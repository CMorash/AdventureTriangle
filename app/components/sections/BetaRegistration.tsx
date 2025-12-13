'use client';

import Card from '@/app/components/ui/Card';
import BetaForm from '@/app/components/forms/BetaForm';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function BetaRegistration() {
  const { isDarkMode } = useTheme();
  
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8 dark:bg-gradient-to-b dark:from-neutral-900/50 dark:to-neutral-800/50" 
      id="beta-registration"
      style={{
        background: isDarkMode 
          ? 'rgb(10, 10, 10)'
          : 'rgb(210, 210, 210)',
        transition: 'background 0.3s ease'
      }}
    >
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Join Our Beta
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-xl mx-auto">
            Be among the first to experience Adventure Triangle. Get early access to our platform and help shape the future of adventure travel.
          </p>
        </div>

        <Card>
          <BetaForm />
        </Card>
      </div>
    </section>
  );
}

