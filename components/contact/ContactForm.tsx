'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Please include a little more detail (at least 10 characters)'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  function onSubmit(data: ContactForm) {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-2xl bg-emerald/10 p-6 font-body text-emerald-deep">
        Thank you for reaching out — we&rsquo;ll respond within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <input
          {...register('name')}
          placeholder="Full name"
          className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register('email')}
          placeholder="Email"
          className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="How can we help?"
          rows={5}
          className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 disabled:opacity-50">
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
