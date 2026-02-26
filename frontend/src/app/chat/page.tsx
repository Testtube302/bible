'use client';

import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ChatContainer } from '@/components/chat/ChatContainer';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <ChatContainer />
      <BottomNav />
    </div>
  );
}
