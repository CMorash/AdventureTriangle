'use client';

import { motion } from 'framer-motion';

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
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8" 
      id="social"
      style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.90625), rgba(255, 255, 255, 1.0))'
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Connect With Us
          </h2>
          <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
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
              className="bg-gradient-to-br from-neutral-50 to-blue-50 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100"
            >
              <div className="text-5xl mb-3">{social.icon}</div>
              <div className="text-lg font-semibold text-neutral-900">{social.name}</div>
              <div className="text-sm text-neutral-600 mt-2">Follow Us</div>
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
          <p className="text-lg text-neutral-700 mb-4">
            Use <span className="font-bold text-blue-600">#FeelTheAdventure</span> to share your stories
          </p>
        </motion.div>
      </div>
    </section>
  );
}

