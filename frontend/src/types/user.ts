export interface Bookmark {
  id: string;
  bookName: string;
  chapter: number;
  verse: number;
  translation: string;
  note: string | null;
  createdAt: string;
}

export interface Highlight {
  id: string;
  bookName: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  translation: string;
  color: string;
  createdAt: string;
}
