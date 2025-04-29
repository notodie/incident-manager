'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDepartments } from '@/hooks/useDepartments';

interface Plan {
  id: string;
  title: string;
  department: {
    id: string;
    name: string;
  };
}

const testSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  planId: z.string().min(1, 'Le plan est requis'),
});

type TestFormData = z.infer<typeof testSchema>;

export default function NewTestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { departments, isLoading: isLoadingDepartments, error: departmentsError } = useDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
  });

  useEffect(() => {
    const fetchPlans = async () => {
      if (!selectedDepartment) {
        setPlans([]);
        return;
      }

      setIsLoadingPlans(true);
      try {
        const response = await fetch(`/api/plans?departmentId=${selectedDepartment}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des plans');
        }
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des plans');
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [selectedDepartment]);

  const onSubmit = async (data: TestFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du test');
      }

      router.push('/tests');
    } catch (err) {
      setError('Une erreur est survenue lors de la création du test');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDepartments) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p>Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (departmentsError) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p className="text-red-600">{departmentsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Nouveau test de reprise
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Remplissez le formulaire ci-dessous pour créer un nouveau test de reprise.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Titre
                    </label>
                    <input
                      type="text"
                      id="title"
                      {...register('title')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      {...register('description')}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

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
                      <option value="">Sélectionnez un service</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="planId" className="block text-sm font-medium text-gray-700">
                      Plan de continuité
                    </label>
                    <select
                      id="planId"
                      {...register('planId')}
                      disabled={!selectedDepartment || isLoadingPlans}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Sélectionnez un plan</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.title}
                        </option>
                      ))}
                    </select>
                    {errors.planId && (
                      <p className="mt-2 text-sm text-red-600">{errors.planId.message}</p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-3 bg-red-50 sm:px-6">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? 'Création en cours...' : 'Créer le test'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 