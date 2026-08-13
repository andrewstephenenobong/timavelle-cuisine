/* Timavelle public contact details: published API content with a static fallback. */
'use client';

import { useEffect, useState } from 'react';
import { getContactDetails, type ContactDetail } from '@/lib/api';

const fallbackDetails: ContactDetail[] = [
  { key: 'address', value: '14 Ilaro Crescent, Lagos' },
  { key: 'hours', value: 'Tue – Sun, 7am – 10pm' },
  { key: 'phone', value: '+234 908 331 7591' },
  { key: 'email', value: 'hello@timavellecuisine.com' },
];

export default function ContactDetails() {
  const [details, setDetails] = useState(fallbackDetails);

  useEffect(() => {
    void getContactDetails().then((items) => {
      if (items.length) setDetails(items);
    });
  }, []);

  return <ul className="flex flex-col gap-3 font-body text-stone">{details.map((detail) => <li key={detail.key}>{detail.value}</li>)}</ul>;
}
