export interface BibleBook {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
  bookOrder: number;
  chapterCount: number;
  verseCount: number;
}

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  score: number;
}
