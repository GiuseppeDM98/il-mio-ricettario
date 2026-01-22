'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { appConfig } from '@/lib/utils/config';

export default function LoginPage() {
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
            Accedi al tuo ricettario
          </h2>
          {appConfig.registrationsEnabled && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Non hai un account?{' '}
              <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Registrati
              </Link>
            </p>
          )}
        </div>
        <AuthForm mode="login" showGoogleButton={appConfig.registrationsEnabled} />

        {/* Test Account Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Account di Test
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><span className="font-medium">Email:</span> test@test.com</p>
            <p><span className="font-medium">Password:</span> admin1</p>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Nota: L'account di test ha l'estrazione AI disabilitata
          </p>
        </div>
      </div>
    </div>
  );
}