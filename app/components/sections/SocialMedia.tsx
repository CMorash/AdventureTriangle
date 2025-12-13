'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';

const socialLinks = [
  {
    name: 'Facebook',
    icon: '📘',
    url: 'https://facebook.com/adventuretriangle',
    color: 'blue',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    url: 'https://linkedin.com/company/adventuretriangle',
    color: 'blue',
  },
  {
    name: 'Instagram',
    icon: '📷',
    url: 'https://instagram.com/adventuretriangle',
    color: 'pink',
  },
  {
    name: 'TikTok',
    icon: '🎵',
    url: 'https://tiktok.com/@adventuretriangle',
    color: 'black',
  },
];

export default function SocialMedia() {
  const { isDarkMode } = useTheme();
  
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8 dark:bg-gradient-to-b dark:from-neutral-900/50 dark:to-neutral-800/50" 
      id="social"
      style={{
        background: isDarkMode 
          ? 'rgb(10, 10, 10)'
          : 'rgb(210, 210, 210)',
        transition: 'background 0.3s ease'
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Connect With Us
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
            Follow our journey and stay updated on the latest adventures, launches, and community stories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-neutral-800 dark:to-blue-900/30 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700"
            >
              <div className="text-5xl mb-3">{social.icon}</div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">{social.name}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Follow Us</div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
            Use <span className="font-bold text-blue-600 dark:text-blue-400">#FeelTheAdventure</span> to share your stories
          </p>
        </motion.div>
      </div>
    </section>
  );
}

