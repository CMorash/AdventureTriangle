'use client';

import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function PartnerCTA() {
  const { isDarkMode } = useTheme();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8" 
      id="partner-cta"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(to bottom, rgba(10, 10, 10, 0.75), rgba(10, 10, 10, 1))'
          : 'linear-gradient(to bottom, rgba(210, 210, 210, 0.75), rgba(210, 210, 210, 1))',
        transition: 'background 0.3s ease'
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <Card className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
            Partner With Us
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Are you an adventure operator looking to expand your reach? Join Adventure Triangle&apos;s global marketplace and connect with travelers worldwide.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/30">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Global Reach</div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                Access travelers from around the world seeking authentic adventures
              </p>
            </div>
            <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/30">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Easy Management</div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                Streamlined booking system and dashboard for managing your operations
              </p>
            </div>
            <div className="p-6 rounded-xl bg-brown-50 dark:bg-brown-900/30">
              <div className="text-3xl font-bold text-brown-600 dark:text-brown-400 mb-2">Showcase Trust</div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                Display certifications and build credibility with verified badges
              </p>
            </div>
          </div>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => scrollToSection('partner-form')}
            className="w-full sm:w-auto"
          >
            Apply to Become a Partner
          </Button>
        </Card>
      </div>
    </section>
  );
}

