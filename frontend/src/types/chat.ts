export type ChatMode = 'scripture_only' | 'explain' | 'debate';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string | null;
  mode: ChatMode;
  createdAt: string;
}
