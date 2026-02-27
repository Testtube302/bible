export interface PlanPassage {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  label: string;
}

export interface PlanReading {
  day: number;
  title: string;
  passages: PlanPassage[];
}

export interface PlanProgress {
  currentDay: number;
  completedDays: number[];
  completedAt: string | null;
}

export interface PlanContent {
  day: number;
  contentType: 'devotional' | 'prayer';
  content: string;
}

export interface PlanCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  planCount: number;
}

export interface Plan {
  id: string;
  slug: string;
  categorySlug: string;
  title: string;
  description: string;
  coverImage: string | null;
  durationDays: number;
  readings: PlanReading[];
  sortOrder: number;
  progress: PlanProgress | null;
}

export interface PlanDetail extends Plan {
  content: PlanContent[];
}
