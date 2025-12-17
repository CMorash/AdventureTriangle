'use client';

import { motion } from 'framer-motion';
import { useEarthMode } from '@/app/contexts/EarthModeContext';

export default function EarthModeToggle() {
  const { isEarthMode, toggleEarthMode } = useEarthMode();

  return (
    <motion.button
      onClick={toggleEarthMode}
      className="fixed top-4 left-4 z-[9999] w-12 h-12 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-neutral-200 dark:border-neutral-700"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isEarthMode ? 'Switch to text mode' : 'Switch to explore Earth'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isEarthMode ? 0 : 180 }}
        transition={{ duration: 0.3 }}
        className="relative w-6 h-6"
      >
        {isEarthMode ? (
          // Text/Typography icon (Aa) for switching back to text mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-blue-500 dark:text-blue-400"
          >
            {/* "A" character */}
            <path d="M3 18 L7 6 L11 18" />
            <path d="M5 14 L9 14" />
            {/* "a" character */}
            <path d="M14 14 C14 12 15.5 11 17.5 11 C19.5 11 21 12 21 14 L21 18" />
            <path d="M21 15 C21 13.5 19.5 13 17.5 13 C15.5 13 14 13.5 14 15 C14 17 15.5 18 17.5 18 C19.5 18 21 17 21 15" />
          </svg>
        ) : (
          // Globe/Earth icon for switching to earth mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-green-500 dark:text-green-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2 C14.5 2 17 6.5 17 12 C17 17.5 14.5 22 12 22 C9.5 22 7 17.5 7 12 C7 6.5 9.5 2 12 2" />
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
}
