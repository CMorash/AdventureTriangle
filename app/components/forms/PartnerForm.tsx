'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';

const partnerSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  adventureType: z.enum(['water', 'air', 'land', 'multiple']).default('multiple'),
  location: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  message: z.string().optional(),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

interface PartnerFormProps {
  onSuccess?: () => void;
}

export default function PartnerForm({ onSuccess }: PartnerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      adventureType: 'multiple' as const,
    },
  });

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Clean up empty strings
      const cleanedData = {
        ...data,
        website: data.website || undefined,
        phone: data.phone || undefined,
        location: data.location || undefined,
        message: data.message || undefined,
      };

      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Thank you! We\'ll review your application and get back to you soon.' });
        reset();
        if (onSuccess) onSuccess();
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Submission failed. Please try again.' });
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Company Name"
        type="text"
        {...register('companyName')}
        error={errors.companyName?.message}
        required
        placeholder="Adventure Co."
      />

      <Input
        label="Contact Name"
        type="text"
        {...register('contactName')}
        error={errors.contactName?.message}
        required
        placeholder="Jane Smith"
      />

      <Input
        label="Email Address"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        required
        placeholder="contact@company.com"
      />

      <Input
        label="Phone Number"
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        placeholder="+1 (555) 123-4567"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Adventure Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register('adventureType')}
          className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="water">Water Activities</option>
          <option value="air">Air Activities</option>
          <option value="land">Land Activities</option>
          <option value="multiple">Multiple Types</option>
        </select>
        {errors.adventureType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.adventureType.message}</p>
        )}
      </div>

      <Input
        label="Location"
        type="text"
        {...register('location')}
        error={errors.location?.message}
        placeholder="City, Country"
      />

      <Input
        label="Website"
        type="url"
        {...register('website')}
        error={errors.website?.message}
        placeholder="https://www.example.com"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Message
        </label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Tell us about your adventure offerings..."
        />
      </div>

      {submitStatus && (
        <div
          className={`p-4 rounded-xl ${
            submitStatus.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}

