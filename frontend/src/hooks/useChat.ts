'use client';

import { useState, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import type { ChatMessage, ChatMode } from '@/types/chat';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState<ChatMode>('explain');
  const streamingContent = useRef('');
  const streamingId = useRef('');

  const handleMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'session':
        setSessionId(data.sessionId);
        break;

      case 'sources':
        // Update the current streaming message with sources
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.isStreaming) {
            return [...prev.slice(0, -1), { ...last, sources: data.verses }];
          }
          return prev;
        });
        break;

      case 'chunk':
        streamingContent.current += data.content;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.isStreaming) {
            return [
              ...prev.slice(0, -1),
              { ...last, content: streamingContent.current },
            ];
          }
          return prev;
        });
        break;

      case 'done':
        setIsStreaming(false);
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.isStreaming) {
            return [
              ...prev.slice(0, -1),
              { ...last, id: data.messageId, isStreaming: false },
            ];
          }
          return prev;
        });
        streamingContent.current = '';
        break;

      case 'error':
        setIsStreaming(false);
        setMessages(prev => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: `Error: ${data.message}`,
          },
        ]);
        streamingContent.current = '';
        break;
    }
  }, []);

  const { connect, disconnect, send, isConnected } = useWebSocket({
    onMessage: handleMessage,
  });

  const sendMessage = useCallback((
    content: string,
    verseContext?: { book: string; chapter: number; verse: number; translation: string }
  ) => {
    if (!content.trim() || isStreaming) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
    };

    // Add placeholder for assistant
    streamingContent.current = '';
    streamingId.current = `streaming-${Date.now()}`;
    const assistantMsg: ChatMessage = {
      id: streamingId.current,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    send({
      type: 'message',
      sessionId,
      mode,
      content,
      verseContext,
    });
  }, [send, sessionId, mode, isStreaming]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    streamingContent.current = '';
  }, []);

  return {
    messages,
    sessionId,
    isStreaming,
    isConnected,
    mode,
    setMode,
    connect,
    disconnect,
    sendMessage,
    clearChat,
  };
}
