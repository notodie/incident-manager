'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BusinessContinuityPlan {
  id: string;
  title: string;
  description: string;
  department: {
    id: string;
    name: string;
  };
  steps: {
    id: string;
    title: string;
    description: string;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const [plan, setPlan] = useState<BusinessContinuityPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/plans/${params.id}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du plan');
        }
        const data = await response.json();
        setPlan(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement du plan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p className="text-red-600">{error || 'Plan non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <Link
            href="/plans"
            className="text-indigo-600 hover:text-indigo-900"
          >
            ← Retour à la liste
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{plan.title}</h1>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Détails du plan
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Créé le {new Date(plan.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {plan.description}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Service</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {plan.department.name}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Étapes du plan</h2>
          <div className="space-y-4">
            {plan.steps.map((step) => (
              <div
                key={step.id}
                className="bg-white shadow overflow-hidden sm:rounded-lg"
              >
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Étape {step.order}
                    </h3>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Titre</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {step.title}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {step.description}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 