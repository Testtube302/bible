'use client';

import { useState, useRef } from 'react';

interface SwipeableCardProps {
  children: React.ReactNode[];
}

export function SwipeableCard({ children }: SwipeableCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    const threshold = 50;

    if (diff > threshold && activeIndex < children.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else if (diff < -threshold && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  return (
    <div
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {children.map((child, i) => (
          <div key={i} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {children.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {children.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeIndex ? 'bg-gold' : 'bg-dark-border'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
