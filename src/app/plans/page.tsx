'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDepartments } from '@/hooks/useDepartments';

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

export default function PlansPage() {
  const [plans, setPlans] = useState<BusinessContinuityPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { departments, isLoading: isLoadingDepartments, error: departmentsError } = useDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedDepartment) {
          queryParams.append('departmentId', selectedDepartment);
        }

        const response = await fetch(`/api/plans?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des plans');
        }
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [selectedDepartment]);

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
          <h1 className="text-3xl font-bold text-gray-900">Plans de continuité</h1>
          <Link
            href="/plans/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nouveau plan
          </Link>
        </div>

        {/* Filtres */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
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
        </div>

        {/* Liste des plans */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {plans.length === 0 ? (
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Aucun plan trouvé
                    </p>
                  </div>
                </div>
              </li>
            ) : (
              plans.map((plan) => (
                <li key={plan.id}>
                  <Link href={`/plans/${plan.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {plan.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {plan.steps.length} étapes
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {plan.department.name}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Créé le {new Date(plan.createdAt).toLocaleDateString()}
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
 