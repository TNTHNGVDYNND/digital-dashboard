import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PreloaderWrapper from '@/components/PreloaderWrapper';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Explicit Promotions',
  description: 'Campaign management and promotions analytics dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <PreloaderWrapper>
          <Navbar />
          <div className="pt-16">{children}</div>
        </PreloaderWrapper>
      </body>
    </html>
  );
}
