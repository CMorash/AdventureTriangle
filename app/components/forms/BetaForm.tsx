'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';

const betaSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  interests: z.array(z.string()).optional(),
});

type BetaFormData = z.infer<typeof betaSchema>;

interface BetaFormProps {
  onSuccess?: () => void;
}

export default function BetaForm({ onSuccess }: BetaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BetaFormData>({
    resolver: zodResolver(betaSchema),
  });

  const onSubmit = async (data: BetaFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Registration successful! We\'ll be in touch soon.' });
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

  const adventureInterests = ['Water Activities', 'Air Activities', 'Land Activities', 'All Adventures'];

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
          Adventure Interests
        </label>
        <div className="space-y-2">
          {adventureInterests.map((interest) => (
            <label key={interest} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={interest}
                {...register('interests')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-neutral-700">{interest}</span>
            </label>
          ))}
        </div>
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
        {isSubmitting ? 'Registering...' : 'Join Beta'}
      </Button>
    </form>
  );
}

