'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ModeSelector } from './ModeSelector';
import { useChat } from '@/hooks/useChat';

export function ChatContainer() {
  const {
    messages,
    isStreaming,
    isConnected,
    mode,
    setMode,
    connect,
    sendMessage,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showConnecting, setShowConnecting] = useState(false);

  // Connect on mount
  useEffect(() => {
    connect();
  }, [connect]);

  // Delay showing "Connecting" banner to avoid flash during brief reconnects
  useEffect(() => {
    if (isConnected) {
      setShowConnecting(false);
      return;
    }
    const timer = setTimeout(() => setShowConnecting(true), 1500);
    return () => clearTimeout(timer);
  }, [isConnected]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-4rem)]">
      {/* Mode selector */}
      <div className="p-3 border-b border-dark-border">
        <ModeSelector current={mode} onChange={setMode} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
              <span className="text-gold text-2xl font-serif">S</span>
            </div>
            <h3 className="text-dark-text font-serif text-lg mb-2">Scripture Assistant</h3>
            <p className="text-dark-muted text-sm max-w-sm">
              Ask questions about the Bible. Every response is grounded in Scripture with verse citations.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                'What does the Bible say about anxiety?',
                'Explain John 3:16',
                'Compare views on grace vs works',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-dark-card border border-dark-border rounded-full px-3 py-1.5 text-dark-muted hover:text-gold hover:border-gold/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Connection status */}
      {showConnecting && (
        <div className="px-4 py-2 bg-burgundy/20 text-burgundy-light text-xs text-center">
          Connecting to Scripture assistant...
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isStreaming || !isConnected} />
    </div>
  );
}
