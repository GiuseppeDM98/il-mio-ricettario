'use client';

import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}