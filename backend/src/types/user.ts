export interface Bookmark {
  id: string;
  bookName: string;
  chapter: number;
  verse: number;
  translation: string;
  note: string | null;
  createdAt: Date;
}

export interface Highlight {
  id: string;
  bookName: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  translation: string;
  color: string;
  createdAt: Date;
}

export interface ReadingProgress {
  bookName: string;
  chapter: number;
  completed: boolean;
  lastVerseRead: number;
  readAt: Date;
}

export interface ReadingStreak {
  date: string;
  chaptersRead: number;
  minutesSpent: number;
}
