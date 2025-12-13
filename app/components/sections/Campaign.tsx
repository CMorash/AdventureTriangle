'use client';

import { motion } from 'framer-motion';

export default function Campaign() {
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8" 
      id="campaign"
      style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8125), rgba(255, 255, 255, 0.90625))'
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
            <h2 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-6">
              #FeelTheAdventure
            </h2>
            <p className="text-2xl text-neutral-700 mb-8 max-w-3xl mx-auto leading-relaxed">
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
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Share Your Story</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Tag us in your adventure posts and use #FeelTheAdventure to be featured in our community gallery.
            </p>
            <p className="text-neutral-600">
              Whether it's skydiving over mountains, diving in crystal-clear waters, or hiking through ancient forests - your adventure inspires others.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Join the Movement</h3>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Follow us on social media and be part of a global community that celebrates authentic, transformative travel experiences.
            </p>
            <p className="text-neutral-600">
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
          <div className="inline-block bg-white rounded-2xl px-8 py-6 shadow-lg">
            <p className="text-lg font-semibold text-neutral-900 mb-2">
              Ready to feel the adventure?
            </p>
            <p className="text-neutral-700">
              Start your journey with Adventure Triangle today
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

