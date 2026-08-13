/* Timavelle public contact details: published API content with a static fallback. */
'use client';

import { useEffect, useState } from 'react';

type ContactDetail = { key: string; value: string };

const fallbackDetails: ContactDetail[] = [
  { key: 'address', value: '14 Ilaro Crescent, Lagos' },
  { key: 'hours', value: 'Tue – Sun, 7am – 10pm' },
  { key: 'phone', value: '+234 908 331 7591' },
  { key: 'email', value: 'hello@timavellecuisine.com' },
];

export default function ContactDetails() {
  const [details, setDetails] = useState(fallbackDetails);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://timavelle-cuisine-backend.onrender.com';
    fetch(`${apiUrl}/api/contact-details`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Contact details unavailable')))
      .then((payload: { items?: ContactDetail[] }) => {
        if (payload.items?.length) setDetails(payload.items);
      })
      .catch(() => undefined);
  }, []);

  return <ul className="flex flex-col gap-3 font-body text-stone">{details.map((detail) => <li key={detail.key}>{detail.value}</li>)}</ul>;
}
