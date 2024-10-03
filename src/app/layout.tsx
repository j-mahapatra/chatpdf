import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'ChatPDF',
  description: 'Talk to PDFs with ChatPDF with the power of AI',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <ClerkProvider>
        <body className={`${inter.variable} antialiased`}>{children}</body>
      </ClerkProvider>
    </html>
  );
}
