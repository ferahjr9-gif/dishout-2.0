import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const paths = {
  infinity: "M8 3.5C5.5 3.5 3.5 5.5 3.5 8C3.5 10.5 5.5 12.5 8 12.5C10.5 12.5 12.5 10.5 16 8C19.5 5.5 21.5 3.5 24 3.5C26.5 3.5 28.5 5.5 28.5 8C28.5 10.5 26.5 12.5 24 12.5C21.5 12.5 19.5 10.5 16 8C12.5 5.5 10.5 3.5 8 3.5Z",
  burger: "M7 9C7 5 11 3.5 16 3.5C21 3.5 25 5 25 9 M5 12H27 M7 12C7 14.5 9 15.5 16 15.5C23 15.5 25 14.5 25 12",
  pizza: "M16 2.5L26 14.5H6L16 2.5Z M16 6V9 M13 11H14 M19 11H18",
  drink: "M10 6L11.5 15.5H20.5L22 6 M8 6H24 M19 6L23 1",
  bowl: "M6 9C6 13.5 10 16.5 16 16.5C22 16.5 26 13.5 26 9 M10 9V4 M16 9V2.5 M22 9V4",
  chicken: "M9 13.5C7 15.5 5 15.5 3 13.5C1 11.5 3 8 6 6L18 13L24 10L26 12L21 16L9 13.5Z"
};

const foodKeys = Object.keys(paths).filter(k => k !== 'infinity');

const AnimatedLogo: React.FC = () => {
  const [currentIcon, setCurrentIcon] = useState('infinity');

  useEffect(() => {
    // Animation Cycle:
    // 1. Show Infinity (Start)
    // 2. Wait 4 seconds
    // 3. Switch to Random Food
    // 4. Wait 2 seconds
    // 5. Switch back to Infinity
    
    const cycleLogo = () => {
      // Pick a random food
      const randomFood = foodKeys[Math.floor(Math.random() * foodKeys.length)];
      setCurrentIcon(randomFood);

      // Switch back to infinity after 2 seconds
      setTimeout(() => {
        setCurrentIcon('infinity');
      }, 2000);
    };

    // Run cycle every 6 seconds (4s wait + 2s display)
    const intervalId = setInterval(cycleLogo, 6000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-[34px] h-[17px] md:w-[44px] md:h-[22px] flex items-center justify-center relative">
      <AnimatePresence mode="wait">
        <motion.svg
          key={currentIcon}
          width="100%"
          height="100%"
          viewBox="0 0 32 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateX: -90 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="absolute inset-0"
        >
          <path
            d={paths[currentIcon as keyof typeof paths]}
            stroke="#FACC15"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedLogo;