'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/ricette');
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crea il tuo ricettario
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hai già un account?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Accedi
            </Link>
          </p>
        </div>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}