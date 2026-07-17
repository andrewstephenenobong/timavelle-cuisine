'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const reservationSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  partySize: z.number()
  .min(1, 'Party size must be at least 1')
  .max(50, 'For groups over 50, contact us directly'),
  date: z.string().min(1, 'Please choose a date').refine((value) => {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return value >= todayString;
  }, "Please choose a date that hasn't already passed"),
  message: z.string().optional(),
});

type ReservationForm = z.infer<typeof reservationSchema>;

export default function ReserveForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
  });

  function onSubmit(data: ReservationForm) {
    console.log('Reservation request:', data);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-2xl bg-emerald/10 p-6 text-center font-body text-emerald-deep">
        Thank you — we&rsquo;ll be in touch shortly to confirm your table.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex max-w-md flex-col gap-4 text-left">
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
        <input
          {...register('partySize', { valueAsNumber: true })}
          type="number"
          placeholder="Party size"
          className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body"
        />
        {errors.partySize && <p className="mt-1 text-sm text-red-600">{errors.partySize.message}</p>}
      </div>

      <div>
        <input
          {...register('date')}
          type="date"
          className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body"
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
      </div>

      <textarea
        {...register('message')}
        placeholder="Anything we should know? (optional)"
        rows={3}
        className="w-full rounded-xl border border-stone/20 px-4 py-3 font-body"
      />

      <Button type="submit" disabled={isSubmitting} className="mt-2 disabled:opacity-50">
        {isSubmitting ? 'Sending…' : 'Send Reservation Request'}
      </Button>
    </form>
  );
}
