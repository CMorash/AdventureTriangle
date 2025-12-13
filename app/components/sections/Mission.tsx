'use client';

import Card from '@/app/components/ui/Card';
import { motion } from 'framer-motion';

const adventures = [
  {
    type: 'Water',
    titleColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: '🌊',
    activities: ['Scuba Diving', 'Rafting', 'Surfing', 'Kayaking', 'Sailing'],
    description: 'Dive into thrilling water adventures from the depths of the ocean to rushing rivers.',
  },
  {
    type: 'Air',
    titleColor: 'text-green-600',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: '✈️',
    activities: ['Skydiving', 'Paragliding', 'Hot Air Balloon', 'Helicopter Tours', 'Bungee Jumping'],
    description: 'Soar through the skies and experience the world from breathtaking heights.',
  },
  {
    type: 'Land',
    titleColor: 'text-brown-600',
    bgColor: 'bg-brown-100',
    textColor: 'text-brown-700',
    icon: '🏔️',
    activities: ['Hiking', 'Rock Climbing', 'Mountain Biking', 'Safari', 'Camping'],
    description: 'Explore diverse terrains and discover the beauty of nature on foot.',
  },
];

export default function Mission() {
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8 relative z-10" 
      id="mission" 
      style={{ 
        isolation: 'isolate',
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.50), rgba(255, 255, 255, 0.75))'
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Our Mission
          </h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto mb-6">
            Connecting adventurers with verified experiences across three realms
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-green-600 to-brown-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {adventures.map((adventure, index) => (
            <motion.div
              key={adventure.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card hover={true} className="h-full">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{adventure.icon}</div>
                  <h3 className={`text-3xl font-bold ${adventure.titleColor} mb-2`}>
                    {adventure.type} Adventures
                  </h3>
                </div>
                <p className="text-neutral-700 mb-6 text-center leading-relaxed">
                  {adventure.description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-neutral-900 mb-3">Popular Activities:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {adventure.activities.map((activity) => (
                      <span
                        key={activity}
                        className={`px-3 py-1 rounded-full text-sm ${adventure.bgColor} ${adventure.textColor}`}
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            We're building the future of adventure - trusted, transformative, and truly global. 
            Join us on an adventure of a lifetime and discover the world in a way you never thought possible.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

