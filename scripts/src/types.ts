export type Translation = 'KJV' | 'WEB' | 'ASV';
export type Testament = 'OT' | 'NT';

export interface NormalizedVerse {
  translation: Translation;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface NormalizedBook {
  name: string;
  abbreviation: string;
  testament: Testament;
  order: number;
  chapterCount: number;
  totalVerses: number;
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
