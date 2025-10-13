'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/ricette', label: 'Le mie ricette' },
  { href: '/categorie', label: 'Categorie' },
  { href: '/ricette/new', label: 'Nuova ricetta' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 p-4 border-r">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className={cn('w-full justify-start', {
                'bg-primary-100 text-primary-700': pathname === item.href,
              })}
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}