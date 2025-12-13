'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';

const eventSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  attendanceType: z.enum(['in-person', 'virtual', 'both']).default('in-person'),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  onSuccess?: () => void;
}

export default function EventForm({ onSuccess }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      attendanceType: 'in-person',
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Registration successful! We\'ll send you event details soon.' 
        });
        reset();
        if (onSuccess) onSuccess();
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Full Name"
        type="text"
        {...register('name')}
        error={errors.name?.message}
        required
        placeholder="John Doe"
      />

      <Input
        label="Email Address"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        required
        placeholder="john@example.com"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Attendance Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register('attendanceType')}
          className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="in-person">In-Person</option>
          <option value="virtual">Virtual</option>
          <option value="both">Both</option>
        </select>
        {errors.attendanceType && (
          <p className="mt-1 text-sm text-red-600">{errors.attendanceType.message}</p>
        )}
      </div>

      {submitStatus && (
        <div
          className={`p-4 rounded-xl ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Registering...' : 'Register for Launch Event'}
      </Button>
    </form>
  );
}

