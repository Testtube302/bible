'use client';

interface AnalyticsCardsProps {
  data: {
    totalChaptersRead: number;
    totalBookmarks: number;
    totalHighlights: number;
    totalChatSessions: number;
    totalChatMessages: number;
    currentStreak: number;
    longestStreak: number;
  } | null;
}

export function AnalyticsCards({ data }: AnalyticsCardsProps) {
  if (!data) return null;

  const cards = [
    { label: 'Chapters Read', value: data.totalChaptersRead, color: 'text-gold' },
    { label: 'Current Streak', value: `${data.currentStreak} days`, color: 'text-green-400' },
    { label: 'Longest Streak', value: `${data.longestStreak} days`, color: 'text-blue-400' },
    { label: 'Bookmarks', value: data.totalBookmarks, color: 'text-gold' },
    { label: 'Highlights', value: data.totalHighlights, color: 'text-purple-400' },
    { label: 'Chat Sessions', value: data.totalChatSessions, color: 'text-gold' },
    { label: 'Chat Messages', value: data.totalChatMessages, color: 'text-dark-text' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {cards.map(card => (
        <div
          key={card.label}
          className="bg-dark-card border border-dark-border rounded-xl p-4"
        >
          <p className="text-dark-muted text-xs mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
