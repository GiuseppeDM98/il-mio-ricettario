'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MobileNav } from './mobile-nav';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger menu */}
        <div className="md:hidden">
          <MobileNav />
        </div>
        <Link href="/ricette">
          <h1 className="text-xl font-bold">Il Mio Ricettario</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm hidden sm:inline">Ciao, {user.displayName || user.email}</span>
            <Button onClick={signOut} size="sm">
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
}