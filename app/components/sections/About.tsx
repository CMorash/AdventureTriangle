'use client';

import { motion } from 'framer-motion';
import Card from '@/app/components/ui/Card';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function About() {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      id="about"
      style={{ 
        isolation: 'isolate',
        background: isDarkMode 
          ? 'linear-gradient(to bottom, rgba(10, 10, 10, 0.25), rgba(10, 10, 10, 0.50))'
          : 'linear-gradient(to bottom, rgba(210, 210, 210, 0.25), rgba(210, 210, 210, 0.50))',
        transition: 'background 0.3s ease'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            About Adventure Triangle
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-green-600 to-brown-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Our Mission</h3>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Adventure Triangle is building a global adventure ecosystem that empowers travelers to discover and book verified, transformative experiences across water, air, and land adventures.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We're creating an emotion-first discovery platform that connects adventurers with trusted local providers through a seamless, mobile-friendly booking experience.
            </p>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">What We Offer</h3>
            <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Verified adventure operators with certifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Global marketplace for water, air, and land activities</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Seamless mobile-friendly booking experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Trusted platform connecting travelers worldwide</span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card hover={true}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">For Travelers</div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Find meaningful, safe adventures worldwide with verified operators
              </p>
            </div>
          </Card>

          <Card hover={true}>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">For Operators</div>
              <p className="text-neutral-600">
                Gain global visibility, manage bookings, and showcase certifications
              </p>
            </div>
          </Card>

          <Card hover={true}>
            <div className="text-center">
              <div className="text-4xl font-bold text-brown-600 mb-2">For Tourism</div>
              <p className="text-neutral-600">
                Promote authentic, sustainable travel experiences
              </p>
            </div>
          </Card>
        </div>
      </div>
    </motion.section>
  );
}

