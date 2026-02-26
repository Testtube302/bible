'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
import type { Verse } from '@/types/bible';

interface CompareViewProps {
  verse: Verse;
  onClose: () => void;
}

export function CompareView({ verse, onClose }: CompareViewProps) {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllTranslations() {
      try {
        const data = await api.get<{ translations: Record<string, string> }>(
          `/bible/${encodeURIComponent(verse.book)}/${verse.chapter}/${verse.verse}`
        );
        setTranslations(data.translations);
      } catch (err) {
        console.error('Failed to fetch translations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllTranslations();
  }, [verse]);

  return (
    <Modal isOpen onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-gold text-xs font-medium tracking-wider uppercase mb-1">
            Compare Translations
          </p>
          <p className="text-dark-text text-sm font-medium">
            {verse.book} {verse.chapter}:{verse.verse}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(translations).map(([trans, text]) => (
              <div
                key={trans}
                className="bg-dark-card border border-dark-border rounded-lg p-4"
              >
                <p className="text-gold text-[10px] font-medium tracking-wider uppercase mb-2">
                  {trans}
                </p>
                <p className="font-serif text-dark-text text-sm leading-relaxed">
                  &ldquo;{text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
