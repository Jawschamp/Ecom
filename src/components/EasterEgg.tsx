import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EasterEggProps {
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

export const EasterEgg: React.FC<EasterEggProps> = ({ poopClicks, onPoopClick, floatingPoops }) => {
  return (
    <>
      {/* Clickable Poop */}
      {poopClicks >= 2 && (
        <motion.span 
          className="cursor-pointer inline-block"
          onClick={onPoopClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          💩
        </motion.span>
      )}

      {/* Floating Poops */}
      <AnimatePresence>
        {floatingPoops.map((poop) => (
          <motion.div
            key={poop.id}
            className="fixed pointer-events-none z-50 text-4xl"
            initial={{ 
              x: poop.x,
              y: poop.y,
              rotate: poop.rotation,
              scale: poop.scale,
              opacity: 1
            }}
            animate={{ 
              y: window.innerHeight + 100,
              rotate: poop.rotation + 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3,
              ease: "linear"
            }}
          >
            💩
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};