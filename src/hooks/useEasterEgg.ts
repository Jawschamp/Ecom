import { useState, useCallback } from 'react';

interface FloatingPoop {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export const useEasterEgg = () => {
  const [poopClicks, setPoopClicks] = useState(0);
  const [floatingPoops, setFloatingPoops] = useState<FloatingPoop[]>([]);

  const handlePoopClick = useCallback(() => {
    setPoopClicks(prev => prev + 1);
    
    if (poopClicks >= 2) { // After 3 clicks total
      const newPoop: FloatingPoop = {
        id: `poop-${Date.now()}`,
        x: Math.random() * window.innerWidth,
        y: -50,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5
      };
      
      setFloatingPoops(prev => [...prev, newPoop]);
      
      setTimeout(() => {
        setFloatingPoops(prev => prev.filter(p => p.id !== newPoop.id));
      }, 3000);
    }
  }, [poopClicks]);

  return {
    poopClicks,
    floatingPoops,
    handlePoopClick
  };
};