import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import AuthSessionProvider from '@/components/SessionProvider';
import ServiceWorker from '@/components/ServiceWorker';
import PWAInstallButton from '@/components/PWAInstallButton';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'IlmPath — Learn Without Limits',
  description:
    'IlmPath is a premium online course platform. Browse, pay, and stream courses securely — works offline too.',
  manifest: '/manifest',
};

export const viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="IlmPath" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased">
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <ServiceWorker />
        <PWAInstallButton />
      </body>
    </html>
  );
}
