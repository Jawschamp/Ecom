import React from 'react';
import { EasterEgg } from './EasterEgg';

interface HeaderProps {
  poopClicks: number;
  onPoopClick: () => void;
  floatingPoops: Array<{
    id: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
  }>;
}

export const Header: React.FC<HeaderProps> = ({ poopClicks, onPoopClick, floatingPoops }) => {
  // Memoize the click handler to prevent unnecessary re-renders
  const handleTitleClick = React.useCallback(() => {
    if (poopClicks < 2) {
      onPoopClick();
    }
  }, [poopClicks, onPoopClick]);

  return (
    <header className="text-center mb-12">
      <h1
        className="font-burbank text-6xl mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-gradient select-none inline-flex items-center gap-4"
        onClick={handleTitleClick}
      >
        <span>Dumb & Viral</span>
        <EasterEgg
          poopClicks={poopClicks}
          onPoopClick={onPoopClick}
          floatingPoops={floatingPoops}
        />
      </h1>
      <p className="font-noto text-gray-400 text-lg select-none">
        Where everything dumb is actually cool, and works (promise)
      </p>
    </header>
  );
};