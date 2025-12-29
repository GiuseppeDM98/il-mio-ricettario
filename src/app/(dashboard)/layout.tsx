'use client';

import { ReactNode, useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { MoreSheet } from '@/components/layout/more-sheet';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils/cn';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  // Reset states on viewport change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 || window.matchMedia('(orientation: portrait)').matches) {
        setSidebarOpen(false);
      }
      if (window.innerWidth >= 1024 || window.matchMedia('(orientation: landscape)').matches) {
        setMoreSheetOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex flex-1">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className={cn(
            'flex-1',
            'lg:p-6',
            'max-lg:portrait:p-4 max-lg:portrait:pb-20',
            'max-lg:landscape:p-4'
          )}>
            {children}
          </main>
        </div>

        <BottomNavigation
          onMoreClick={() => setMoreSheetOpen(true)}
        />

        <MoreSheet
          open={moreSheetOpen}
          onOpenChange={setMoreSheetOpen}
        />

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
