import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Playfair_Display, Poppins, Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-playfair' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-poppins' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Timavelle Cuisine — Private Culinary House',
    template: '%s',
  },
  description: 'A private culinary house crafting elevated menus and bespoke catering.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
