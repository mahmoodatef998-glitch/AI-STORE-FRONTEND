import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { FixHydrationScript } from '@/components/FixHydrationScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Equipment Inventory Management',
  description: 'Manage equipment inventory, track consumption, and get AI predictions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <FixHydrationScript />
        {children}
      </body>
    </html>
  );
}

