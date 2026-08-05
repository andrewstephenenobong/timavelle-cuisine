'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const enquirySchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  eventDate: z.string().optional(),
  partySize: z.coerce.number().min(1).max(500).optional().or(z.literal('')),
  message: z.string().min(10, 'Please include a little more detail (at least 10 characters)'),
});

type EnquiryFormInput = z.input<typeof enquirySchema>;
type EnquiryFormOutput = z.output<typeof enquirySchema>;

export default function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormInput, any, EnquiryFormOutput>({
    resolver: zodResolver(enquirySchema),
  });

  async function onSubmit(data: EnquiryFormOutput) {
    setServerError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return (
      <p className="rounded-2xl bg-emerald/10 p-6 font-body text-emerald-deep">
        Thank you — we&rsquo;ll be in touch shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <input {...register('name')} placeholder="Full name" className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body" />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <input {...register('email')} placeholder="Email" className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body" />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <input {...register('phone')} placeholder="Phone (optional)" className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body" />

      <div className="grid gap-4 sm:grid-cols-2">
        <input {...register('eventDate')} type="date" placeholder="Event date (optional)" className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body" />
        <input {...register('partySize')} type="number" placeholder="Party size (optional)" className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body" />
      </div>

      <div>
        <textarea {...register('message')} placeholder="Tell us about your event or question" rows={4} className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body" />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 disabled:opacity-50">
        {isSubmitting ? 'Sending…' : 'Send Enquiry'}
      </Button>
    </form>
  );
}
