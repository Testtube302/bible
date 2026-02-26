'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ChapterQuestion } from '@/types/quest';

interface QuestionCardProps {
  question: ChapterQuestion;
  index: number;
  onAnswer: (questionIndex: number, answer: number) => Promise<{ correct: boolean; xpAwarded: number } | null>;
}

export function QuestionCard({ question, index, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; xpAwarded: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = async (optionIndex: number) => {
    if (result || submitting) return;
    setSelected(optionIndex);
    setSubmitting(true);
    const res = await onAnswer(index, optionIndex);
    setResult(res);
    setSubmitting(false);
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 mb-4">
      <p className="text-dark-text text-sm font-medium mb-4">
        {index + 1}. {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, i) => {
          let optClass = 'border-dark-border hover:border-gold/30';
          if (result) {
            if (i === question.answer) {
              optClass = 'border-green-500/60 bg-green-500/10';
            } else if (i === selected && !result.correct) {
              optClass = 'border-red-500/60 bg-red-500/10';
            }
          } else if (i === selected) {
            optClass = 'border-gold/50 bg-gold/5';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={!!result || submitting}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors',
                optClass,
                result ? 'cursor-default' : 'cursor-pointer'
              )}
            >
              <span className="text-dark-muted mr-2">{String.fromCharCode(65 + i)}.</span>
              <span className="text-dark-text">{option}</span>
            </button>
          );
        })}
      </div>
      {result && (
        <div className={cn(
          'mt-3 p-3 rounded-lg text-sm',
          result.correct ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'
        )}>
          <p className="font-medium mb-1">
            {result.correct ? 'Correct!' : 'Not quite.'}
            {result.xpAwarded > 0 && ` +${result.xpAwarded} XP`}
          </p>
          <p className="text-dark-muted text-xs">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
