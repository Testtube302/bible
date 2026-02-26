export interface AdminSession {
  id: string;
  token: string;
  expiresAt: Date;
}

export interface AnalyticsSummary {
  totalChaptersRead: number;
  totalBookmarks: number;
  totalHighlights: number;
  totalChatSessions: number;
  totalChatMessages: number;
  currentStreak: number;
  longestStreak: number;
}

export interface TopSearchQuery {
  query: string;
  count: number;
}

export interface PopularBook {
  bookName: string;
  chaptersRead: number;
}
