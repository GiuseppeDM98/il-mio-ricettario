'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <div className="md:hidden fixed bottom-4 right-4">
          <MobileNav />
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}