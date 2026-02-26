'use client';

import Link from 'next/link';
import type { Topic } from '@/hooks/useTopics';

interface TopicCardProps {
  topic: Topic;
}

const TOPIC_ICONS: Record<string, string> = {
  love: '\u{2764}\u{FE0F}',
  faith: '\u{1F64F}',
  forgiveness: '\u{1F54A}\u{FE0F}',
  prayer: '\u{1F9CE}',
  salvation: '\u{271D}\u{FE0F}',
  wisdom: '\u{1F4A1}',
  suffering: '\u{1F622}',
  hope: '\u{1F31F}',
  justice: '\u{2696}\u{FE0F}',
  peace: '\u{1F54A}\u{FE0F}',
  courage: '\u{1F6E1}\u{FE0F}',
  creation: '\u{1F30D}',
  heaven: '\u{2601}\u{FE0F}',
  sin: '\u{26A0}\u{FE0F}',
  worship: '\u{1F3B5}',
};

export function TopicCard({ topic }: TopicCardProps) {
  const icon = TOPIC_ICONS[topic.slug] ?? '\u{1F4D6}';

  return (
    <Link href={`/topics/${topic.slug}`}>
      <div className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-gold/30 transition-colors">
        <div className="text-2xl mb-2">{icon}</div>
        <h3 className="text-gold font-serif text-sm font-semibold mb-1">
          {topic.label}
        </h3>
        <p className="text-dark-muted text-xs leading-relaxed">
          {topic.description}
        </p>
      </div>
    </Link>
  );
}
