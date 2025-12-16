'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function Campaign() {
  const { isDarkMode } = useTheme();
  
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8 dark:bg-gradient-to-b dark:from-neutral-900/50 dark:to-neutral-800/50" 
      id="campaign"
      style={{
        background: isDarkMode 
          ? 'rgb(10, 10, 10)'
          : 'rgb(210, 210, 210)',
        transition: 'background 0.3s ease'
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl sm:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
              Feel The Adventure
            </h2>
            <p className="text-2xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Share your adventure stories and join a community of explorers discovering the world one experience at a time.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-100 dark:border-neutral-700"
          >
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Share Your Story</h3>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Tag us in your adventure posts and use #FeelTheAdventure to be featured in our community gallery.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Whether it&apos;s skydiving over mountains, diving in crystal-clear waters, or hiking through ancient forests - your adventure inspires others.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-100 dark:border-neutral-700"
          >
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Join the Movement</h3>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Follow us on social media and be part of a global community that celebrates authentic, transformative travel experiences.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Connect with fellow adventurers, discover new destinations, and get inspired for your next journey.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-block bg-white dark:bg-neutral-800 rounded-2xl px-8 py-6 shadow-lg border border-neutral-100 dark:border-neutral-700">
            <p className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Ready to feel the adventure?
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              Start your journey with Adventure Triangle today
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

