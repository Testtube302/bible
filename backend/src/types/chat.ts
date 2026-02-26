export type ChatMode = 'scripture_only' | 'explain' | 'debate';
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface ChatSession {
  id: string;
  title: string | null;
  mode: ChatMode;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  versesCited: string[] | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

export interface LLMStreamChunk {
  content: string;
  done: boolean;
}

export interface VerseContext {
  book: string;
  chapter: number;
  verse: number;
  translation: string;
}

export interface ClientChatMessage {
  type: 'message';
  sessionId: string | null;
  mode: ChatMode;
  content: string;
  verseContext?: VerseContext;
}

export interface ServerMessage {
  type: 'session' | 'sources' | 'chunk' | 'done' | 'error';
  [key: string]: any;
}
