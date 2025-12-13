'use client';

import Card from '@/app/components/ui/Card';
import PartnerForm from '@/app/components/forms/PartnerForm';

export default function PartnerFormSection() {
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8" 
      id="partner-form"
      style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.53125), rgba(255, 255, 255, 0.625))'
      }}
    >
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Partner Application
          </h2>
          <p className="text-xl text-neutral-700 max-w-xl mx-auto">
            Join our global marketplace and connect with adventure seekers worldwide. Fill out the form below to get started.
          </p>
        </div>

        <Card>
          <PartnerForm />
        </Card>
      </div>
    </section>
  );
}

