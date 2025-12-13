'use client';

import Card from '@/app/components/ui/Card';
import EventForm from '@/app/components/forms/EventForm';

export default function LaunchEvent() {
  return (
    <section 
      className="py-20 px-4 sm:px-6 lg:px-8" 
      id="launch-event"
      style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.625), rgba(255, 255, 255, 0.71875))'
      }}
    >
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Launch Event Registration
          </h2>
          <p className="text-xl text-neutral-700 max-w-xl mx-auto mb-2">
            Join us for our official launch event on January 26, 2026
          </p>
          <p className="text-lg text-neutral-600">
            Toronto, Canada • Available in-person and virtual
          </p>
        </div>

        <Card>
          <EventForm />
        </Card>
      </div>
    </section>
  );
}

