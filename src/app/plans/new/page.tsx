'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDepartments } from '@/hooks/useDepartments';

const planSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  departmentId: z.string().min(1, 'Le service est requis'),
  steps: z.array(
    z.object({
      title: z.string().min(1, 'Le titre de l\'étape est requis'),
      description: z.string().min(1, 'La description de l\'étape est requise'),
    })
  ).min(1, 'Au moins une étape est requise'),
});

type PlanFormData = z.infer<typeof planSchema>;

export default function NewPlanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { departments, isLoading: isLoadingDepartments, error: departmentsError } = useDepartments();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      steps: [{ title: '', description: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const onSubmit = async (data: PlanFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du plan');
      }

      router.push('/plans');
    } catch (err) {
      setError('Une erreur est survenue lors de la création du plan');
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
              Nouveau plan de continuité
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Remplissez le formulaire ci-dessous pour créer un nouveau plan de continuité.
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
                    <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                      Service
                    </label>
                    <select
                      id="departmentId"
                      {...register('departmentId')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Sélectionnez un service</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                    {errors.departmentId && (
                      <p className="mt-2 text-sm text-red-600">{errors.departmentId.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Étapes
                      </label>
                      <button
                        type="button"
                        onClick={() => append({ title: '', description: '' })}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Ajouter une étape
                      </button>
                    </div>
                    {fields.map((field, index) => (
                      <div key={field.id} className="mb-4 p-4 border border-gray-200 rounded-md">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-sm font-medium text-gray-700">
                            Étape {index + 1}
                          </h4>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor={`steps.${index}.title`} className="block text-sm font-medium text-gray-700">
                              Titre
                            </label>
                            <input
                              type="text"
                              {...register(`steps.${index}.title`)}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                            {errors.steps?.[index]?.title && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.steps[index]?.title?.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label htmlFor={`steps.${index}.description`} className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              {...register(`steps.${index}.description`)}
                              rows={2}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                            {errors.steps?.[index]?.description && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.steps[index]?.description?.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {errors.steps && (
                      <p className="mt-2 text-sm text-red-600">{errors.steps.message}</p>
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
                    {isSubmitting ? 'Création en cours...' : 'Créer le plan'}
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