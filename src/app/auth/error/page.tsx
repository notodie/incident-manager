'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Erreur d'authentification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error === 'CredentialsSignin'
              ? 'Email ou mot de passe incorrect'
              : 'Une erreur est survenue lors de la connexion'}
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/auth/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
} 