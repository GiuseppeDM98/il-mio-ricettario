'use client';

import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <title>Il Mio Ricettario - Gestisci le tue ricette</title>
        <meta name="description" content="Un ricettario digitale privato per organizzare e cucinare le tue ricette preferite con intelligenza artificiale." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}