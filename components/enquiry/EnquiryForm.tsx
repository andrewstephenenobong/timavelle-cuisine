'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { track } from '@vercel/analytics';
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
      track('enquiry_submitted', { source: 'contact-form' });
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
        <input id="enquiry-name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'enquiry-name-error' : undefined} {...register('name')} placeholder="Your name" className="w-full border-b border-stone/20 px-0 py-3 font-body" />
        {errors.name && <p id="enquiry-name-error" role="alert" className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-2 block font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-email">Email</label>
        <input id="enquiry-email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'enquiry-email-error' : undefined} {...register('email')} placeholder="you@example.com" className="w-full border-b border-stone/20 px-0 py-3 font-body" />
        {errors.email && <p id="enquiry-email-error" role="alert" className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
      </div>

      <div><label className="mb-2 block font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-phone">Phone <span className="text-stone">(optional)</span></label><input id="enquiry-phone" autoComplete="tel" {...register('phone')} placeholder="+234 …" className="w-full border-b border-stone/20 px-0 py-3 font-body" /></div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-event-date">Event date <input id="enquiry-event-date" {...register('eventDate')} type="date" className="mt-2 w-full border-b border-stone/20 px-0 py-3 font-body" /></label>
        <label className="font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-party-size">Guests <input id="enquiry-party-size" aria-invalid={Boolean(errors.partySize)} aria-describedby={errors.partySize ? 'enquiry-party-size-error' : undefined} {...register('partySize')} type="number" placeholder="Optional" className="mt-2 w-full border-b border-stone/20 px-0 py-3 font-body" /></label>
      </div>
      {errors.partySize && <p id="enquiry-party-size-error" role="alert" className="text-sm text-red-700">{errors.partySize.message}</p>}

      <div>
        <label className="mb-2 block font-utility text-xs uppercase tracking-wider text-ink" htmlFor="enquiry-message">Tell us about the room</label>
        <textarea id="enquiry-message" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'enquiry-message-error' : undefined} {...register('message')} placeholder="The kind of occasion, the feeling, and anything we should know…" rows={4} className="w-full border-b border-stone/20 px-0 py-3 font-body" />
        {errors.message && <p id="enquiry-message-error" role="alert" className="mt-1 text-sm text-red-700">{errors.message.message}</p>}
      </div>

      {serverError && <p role="alert" aria-live="assertive" className="text-sm text-red-700">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2 disabled:opacity-50">
        {isSubmitting ? 'Sending…' : 'Send Enquiry'}
      </Button>
    </form>
  );
}
