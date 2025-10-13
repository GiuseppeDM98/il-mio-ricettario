'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/ricette', label: 'Le mie ricette' },
  { href: '/ricette/new', label: 'Nuova ricetta' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs">
        <div className="flex justify-between items-center mb-6">
            <Link href="/" onClick={() => setIsOpen(false)}>
                <h2 className="text-lg font-bold">Il Mio Ricettario</h2>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
            </Button>
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}