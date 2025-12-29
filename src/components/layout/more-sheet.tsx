'use client';

import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Grid3x3, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoreSheet({ open, onOpenChange }: MoreSheetProps) {
  const menuItems = [
    { label: 'Categorie', icon: Grid3x3, href: '/categorie' },
    { label: 'Estrattore AI', icon: Sparkles, href: '/estrattore-ricette' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          'max-lg:portrait:rounded-t-xl',
          'lg:hidden max-lg:landscape:hidden'
        )}
      >
        <SheetHeader>
          <SheetTitle>Altro</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3',
                  'text-sm font-medium hover:bg-accent transition-colors'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
