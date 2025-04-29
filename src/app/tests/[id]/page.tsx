'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Test {
  id: string;
  title: string;
  description: string;
  plan: {
    id: string;
    title: string;
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
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  results: {
    id: string;
    stepId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILURE';
    notes: string;
  }[];
  createdAt: string;
  completedAt: string | null;
}

export default function TestDetailPage({ params }: { params: { id: string } }) {
  const [test, setTest] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/tests/${params.id}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du test');
        }
        const data = await response.json();
        setTest(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement du test');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [params.id]);

  const handleResultUpdate = async (resultId: string, status: 'SUCCESS' | 'FAILURE', notes: string) => {
    if (!test) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tests/${params.id}/results/${resultId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du résultat');
      }

      const updatedTest = await response.json();
      setTest(updatedTest);
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour du résultat');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: Test['status']) => {
    if (!test) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tests/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'COMPLETED' && { completedAt: new Date().toISOString() }),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du test');
      }

      const updatedTest = await response.json();
      setTest(updatedTest);
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour du test');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p className="text-red-600">{error || 'Test non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <Link
            href="/tests"
            className="text-indigo-600 hover:text-indigo-900"
          >
            ← Retour à la liste
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{test.title}</h1>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Détails du test
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Créé le {new Date(test.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <select
                  value={test.status}
                  onChange={(e) => handleStatusChange(e.target.value as Test['status'])}
                  disabled={isUpdating}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="PENDING">En attente</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="COMPLETED">Réussi</option>
                  <option value="FAILED">Échoué</option>
                </select>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {test.description}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Service</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {test.plan.department.name}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Plan de continuité</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {test.plan.title}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Résultats des étapes</h2>
          <div className="space-y-4">
            {test.plan.steps.map((step) => {
              const result = test.results.find((r) => r.stepId === step.id);
              return (
                <div
                  key={step.id}
                  className="bg-white shadow overflow-hidden sm:rounded-lg"
                >
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Étape {step.order}
                      </h3>
                      {result && (
                        <select
                          value={result.status}
                          onChange={(e) => handleResultUpdate(result.id, e.target.value as 'SUCCESS' | 'FAILURE', result.notes)}
                          disabled={isUpdating}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="PENDING">En attente</option>
                          <option value="SUCCESS">Réussi</option>
                          <option value="FAILURE">Échoué</option>
                        </select>
                      )}
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
                      {result && (
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Notes</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <textarea
                              value={result.notes}
                              onChange={(e) => handleResultUpdate(result.id, result.status, e.target.value)}
                              disabled={isUpdating}
                              rows={3}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 