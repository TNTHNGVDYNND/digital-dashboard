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

const THEME_BOOTSTRAP = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark' || theme === 'light') {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      }
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="theme-bootstrap"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <PreloaderWrapper>
          <Navbar />
          <div className="pt-16">{children}</div>
        </PreloaderWrapper>
      </body>
    </html>
  );
}
