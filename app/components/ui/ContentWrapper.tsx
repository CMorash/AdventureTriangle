'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ContentWrapperProps {
  children: ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
  return (
    <motion.div
      initial={{ y: 30 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ 
        willChange: 'transform',
        opacity: 1 // Always fully opaque - sections handle their own opacity via backgrounds
      }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}

