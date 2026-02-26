export interface QuestDashboard {
  totalXP: number;
  level: number;
  xpToNextLevel: number;
  currentStreak: number;
  chaptersRead: number;
  questionsAnswered: number;
  correctAnswers: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface ChapterQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  versesCited: string[];
}
