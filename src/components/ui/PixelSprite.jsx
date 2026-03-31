import React from 'react';
import { motion } from 'framer-motion';

const PixelSprite = ({ 
  data, 
  size = 8, 
  scale = 4, 
  animate = true, 
  delay = 0,
  className = "" 
}) => {
  if (!data || !data.length) return null;

  const rows = data.length;
  const cols = data[0].length;

  const bouncyVariants = {
    initial: { y: 0, scale: 1 },
    animate: { 
      y: [0, -15, 0], 
      scale: [1, 1.1, 0.9, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2 + Math.random(),
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }
  };

  return (
    <motion.div 
      className={`pixel-sprite-container ${className}`}
      variants={animate ? bouncyVariants : {}}
      initial="initial"
      animate="animate"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        width: cols * scale,
        height: rows * scale,
        gap: 0,
        pointerEvents: 'none',
        imageRendering: 'pixelated'
      }}
    >
      {data.map((row, y) => (
        row.map((color, x) => (
          <div 
            key={`${y}-${x}`} 
            style={{ 
              backgroundColor: color === ' ' ? 'transparent' : color,
              width: scale,
              height: scale
            }} 
          />
        ))
      ))}
    </motion.div>
  );
};

export default PixelSprite;

// Preset Sprites
export const SPRITES = {
  HEART: [
    "  # #   ",
    " # # #  ",
    "####### ",
    "####### ",
    " #####  ",
    "  ###   ",
    "   #    "
  ].map(row => row.split('').map(c => c === '#' ? '#ef4444' : ' ')),
  
  SMILEY: [
    "  ###   ",
    " #   #  ",
    "# # # # ",
    "#     # ",
    "# # # # ",
    " #   #  ",
    "  ###   "
  ].map(row => row.split('').map(c => c === '#' ? '#facc15' : ' ')),

  GHOST: [
    "  ####  ",
    " ###### ",
    "## ## ##",
    "########",
    "########",
    "# # # # "
  ].map(row => row.split('').map(c => c === '#' ? '#94a3b8' : ' ')),

  PEN: [
    "      # ",
    "     ## ",
    "    ##  ",
    "   ##   ",
    "  ##    ",
    " ##     ",
    "#       "
  ].map(row => row.split('').map(c => c === '#' ? '#3b82f6' : ' '))
};
