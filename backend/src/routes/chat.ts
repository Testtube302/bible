import type { FastifyInstance } from 'fastify';
import * as chatService from '../services/chat.service.js';
import * as ragService from '../services/rag.service.js';
import { query } from '../db/postgres.js';
import type { ClientChatMessage } from '../types/chat.js';

const MAX_MESSAGES_PER_MINUTE = 10;

export async function chatRoutes(app: FastifyInstance): Promise<void> {
  app.get('/chat', { websocket: true }, (socket, request) => {
    const messageTimestamps: number[] = [];

    app.log.info('WebSocket client connected');

    // Keepalive ping every 30s to prevent Apache proxy timeout
    const pingInterval = setInterval(() => {
      if (socket.readyState === 1) { // OPEN
        socket.ping();
      }
    }, 30000);

    socket.on('message', async (rawMessage: Buffer) => {
      try {
        const message: ClientChatMessage = JSON.parse(rawMessage.toString());

        // Rate limit check
        const now = Date.now();
        const recentTimestamps = messageTimestamps.filter(t => now - t < 60000);
        messageTimestamps.length = 0;
        messageTimestamps.push(...recentTimestamps);

        if (messageTimestamps.length >= MAX_MESSAGES_PER_MINUTE) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Rate limit exceeded. Please wait before sending more messages.',
            code: 'RATE_LIMIT',
          }));
          return;
        }
        messageTimestamps.push(now);

        // Validate message
        if (!message.content || !message.mode) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Message content and mode are required.',
            code: 'INVALID_MESSAGE',
          }));
          return;
        }

        // Get or create session
        const sessionId = message.sessionId || await chatService.createSession(message.mode);
        socket.send(JSON.stringify({ type: 'session', sessionId }));

        // Save user message
        await chatService.saveMessage(sessionId, 'user', message.content);

        // Get conversation history
        const history = await chatService.getSessionHistory(sessionId);

        // Retrieve sources and send to client
        const sources = await ragService.retrieveSources(message.content, message.verseContext);
        socket.send(JSON.stringify({
          type: 'sources',
          verses: sources.slice(0, 10).map(s => `${s.book} ${s.chapter}:${s.verse}`),
        }));

        // Stream AI response
        let fullResponse = '';
        for await (const chunk of ragService.generateResponse(
          message.content,
          message.mode,
          history.slice(0, -1), // exclude the message we just saved
          message.verseContext
        )) {
          if (chunk.content) {
            fullResponse += chunk.content;
            socket.send(JSON.stringify({ type: 'chunk', content: chunk.content }));
          }
        }

        // Extract cited verses from response (simple regex for "Book Ch:V" patterns)
        const versePattern = /(\d?\s?[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s(\d+):(\d+(?:-\d+)?)/g;
        const versesCited: string[] = [];
        let match;
        while ((match = versePattern.exec(fullResponse)) !== null) {
          versesCited.push(match[0]);
        }

        // Save assistant message
        const msgId = await chatService.saveMessage(sessionId, 'assistant', fullResponse, versesCited);

        // Log analytics
        await query(
          'INSERT INTO analytics_events (event_type, event_data) VALUES ($1, $2)',
          ['chat', JSON.stringify({ mode: message.mode, sessionId, questionLength: message.content.length })]
        ).catch(() => {});

        socket.send(JSON.stringify({ type: 'done', messageId: msgId }));

      } catch (err) {
        app.log.error(err, 'WebSocket message handling error');
        socket.send(JSON.stringify({
          type: 'error',
          message: 'An error occurred processing your message.',
          code: 'INTERNAL_ERROR',
        }));
      }
    });

    socket.on('close', () => {
      clearInterval(pingInterval);
      app.log.info('WebSocket client disconnected');
    });
  });
}
