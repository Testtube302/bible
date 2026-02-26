'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ChatContainer } from '@/components/chat/ChatContainer';

export default function ChatPage() {
  // Force a full page reload on client-side navigation so WebSocket connects cleanly
  useEffect(() => {
    const reloaded = sessionStorage.getItem('chat-reloaded');
    if (!reloaded) {
      sessionStorage.setItem('chat-reloaded', 'true');
      window.location.reload();
      return;
    }
    sessionStorage.removeItem('chat-reloaded');
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <ChatContainer />
      <BottomNav />
    </div>
  );
}
