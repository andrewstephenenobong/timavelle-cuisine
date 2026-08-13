'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import { submitEnquiry } from '@/lib/api';

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
  } = useForm<EnquiryFormInput, unknown, EnquiryFormOutput>({
    resolver: zodResolver(enquirySchema),
  });

  async function onSubmit(data: EnquiryFormOutput) {
    setServerError('');
    try {
      await submitEnquiry(data);
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" aria-label="Timavelle enquiry form">
      <div>
        <label className="mb-2 block font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-name">Name</label>
        <input id="enquiry-name" autoComplete="name" {...register('name')} placeholder="Your name" className="w-full border-b border-stone/20 px-0 py-3 font-body" />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-2 block font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-email">Email</label>
        <input id="enquiry-email" autoComplete="email" {...register('email')} placeholder="you@example.com" className="w-full border-b border-stone/20 px-0 py-3 font-body" />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div><label className="mb-2 block font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-phone">Phone <span className="text-stone/60">(optional)</span></label><input id="enquiry-phone" autoComplete="tel" {...register('phone')} placeholder="+234 …" className="w-full border-b border-stone/20 px-0 py-3 font-body" /></div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="font-utility text-xs uppercase tracking-wider text-ink">Event date <input {...register('eventDate')} type="date" className="mt-2 w-full border-b border-stone/20 px-0 py-3 font-body" /></label>
        <label className="font-utility text-xs uppercase tracking-wider text-ink">Guests <input {...register('partySize')} type="number" placeholder="Optional" className="mt-2 w-full border-b border-stone/20 px-0 py-3 font-body" /></label>
      </div>

      <div>
        <label className="mb-2 block font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-message">Tell us about the room</label>
        <textarea id="enquiry-message" {...register('message')} placeholder="The kind of occasion, the feeling, and anything we should know…" rows={4} className="w-full border-b border-stone/20 px-0 py-3 font-body" />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 disabled:opacity-50">
        {isSubmitting ? 'Sending…' : 'Send Enquiry'}
      </Button>
    </form>
  );
}
