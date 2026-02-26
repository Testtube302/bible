export type Translation = 'KJV' | 'WEB' | 'ASV';
export type Testament = 'OT' | 'NT';

export interface BibleBook {
  id: number;
  name: string;
  abbreviation: string;
  testament: Testament;
  bookOrder: number;
  chapterCount: number;
  verseCount: number;
}

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: Translation;
}

export interface CrossReference {
  fromBook: string;
  fromChapter: number;
  fromVerse: number;
  toBook: string;
  toChapter: number;
  toVerseStart: number;
  toVerseEnd: number;
  votes: number;
}

export interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: Translation;
  score: number;
}
