import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/components/QueryProvider';
import { UploadLimitModalProvider } from '@/components/UploadLimitModalProvider';

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
    <ClerkProvider>
      <QueryProvider>
        <UploadLimitModalProvider>
          <html lang='en'>
            <body className={`${inter.variable} antialiased`}>
              <Toaster />
              {children}
            </body>
          </html>
        </UploadLimitModalProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
