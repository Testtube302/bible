export interface JourneyPassage {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  label: string;
}

export interface JourneyProgress {
  currentPassage: number;
  completed: boolean;
}

export interface JourneyContent {
  contentType: 'introduction' | 'transition' | 'reflection';
  position: number;
  content: string;
}

export interface Journey {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  era: string | null;
  passages: JourneyPassage[];
  sortOrder: number;
  progress: JourneyProgress | null;
}

export interface JourneyDetail extends Journey {
  content: JourneyContent[];
}
