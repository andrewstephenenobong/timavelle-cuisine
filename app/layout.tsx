import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/next';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-playfair' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-poppins' });
export const metadata: Metadata = {
  metadataBase: new URL('https://timavelle-cuisine.vercel.app'),
  title: {
    default: 'Timavelle Cuisine — Private Culinary House',
    template: '%s',
  },
  description: 'A private culinary house crafting elevated menus and bespoke catering in Lagos.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Timavelle Cuisine — Private Culinary House',
    description: 'Elevated menus and bespoke catering for the rooms and occasions that matter.',
    url: '/',
    siteName: 'Timavelle Cuisine',
    type: 'website',
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timavelle Cuisine — Private Culinary House',
    description: 'Elevated menus and bespoke catering in Lagos.',
  },
  robots: { index: true, follow: true },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Timavelle Cuisine',
  url: 'https://timavelle-cuisine.vercel.app',
  telephone: '+234 908 331 7591',
  email: 'hello@timavellecuisine.com',
  address: { '@type': 'PostalAddress', streetAddress: '14 Ilaro Crescent', addressLocality: 'Lagos', addressCountry: 'NG' },
  openingHours: 'Tu-Su 07:00-22:00',
  servesCuisine: ['African', 'International'],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
