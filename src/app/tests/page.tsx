'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDepartments } from '@/hooks/useDepartments';

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
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  results: {
    stepId: string;
    status: 'SUCCESS' | 'FAILURE';
    notes: string;
  }[];
  createdAt: string;
  completedAt: string | null;
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { departments, isLoading: isLoadingDepartments, error: departmentsError } = useDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedDepartment) {
          queryParams.append('departmentId', selectedDepartment);
        }
        if (selectedStatus) {
          queryParams.append('status', selectedStatus);
        }

        const response = await fetch(`/api/tests?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des tests');
        }
        const data = await response.json();
        setTests(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des tests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [selectedDepartment, selectedStatus]);

  if (isLoading || isLoadingDepartments) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || departmentsError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p className="text-red-600">{error || departmentsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tests de reprise</h1>
          <Link
            href="/tests/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nouveau test
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Service
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Tous les services</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Réussi</option>
                <option value="FAILED">Échoué</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des tests */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {tests.length === 0 ? (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Aucun test trouvé
                    </p>
                  </div>
                </div>
              </li>
            ) : (
              tests.map((test) => (
                <li key={test.id}>
                  <Link href={`/tests/${test.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {test.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            test.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : test.status === 'FAILED'
                              ? 'bg-red-100 text-red-800'
                              : test.status === 'IN_PROGRESS'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {test.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {test.plan.department.name} - {test.plan.title}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Créé le {new Date(test.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 