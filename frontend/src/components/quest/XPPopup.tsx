'use client';

import { useEffect, useState } from 'react';

interface XPPopupProps {
  amount: number;
  onDone: () => void;
}

export function XPPopup({ amount, onDone }: XPPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed top-20 right-4 z-50 bg-gold text-dark-bg px-4 py-2 rounded-full font-bold text-sm shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      +{amount} XP
    </div>
  );
}
