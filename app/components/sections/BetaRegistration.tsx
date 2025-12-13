'use client';

import Card from '@/app/components/ui/Card';
import BetaForm from '@/app/components/forms/BetaForm';

export default function BetaRegistration() {
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8" 
      id="beta-registration"
      style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.71875), rgba(255, 255, 255, 0.8125))'
      }}
    >
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Join Our Beta
          </h2>
          <p className="text-xl text-neutral-700 max-w-xl mx-auto">
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

