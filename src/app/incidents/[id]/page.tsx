'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Incident {
  id: string;
  title: string;
  description: string;
  type: 'TECHNICAL' | 'SECURITY' | 'OPERATIONAL' | 'ENVIRONMENTAL' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  department: {
    id: string;
    name: string;
  };
  assignedTo: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await fetch(`/api/incidents/${params.id}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement de l\'incident');
        }
        const data = await response.json();
        setIncident(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement de l\'incident');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncident();
  }, [params.id]);

  const handleStatusChange = async (newStatus: Incident['status']) => {
    if (!incident) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/incidents/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'RESOLVED' && { resolvedAt: new Date().toISOString() }),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'incident');
      }

      const updatedIncident = await response.json();
      setIncident(updatedIncident);
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour de l\'incident');
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

  if (error || !incident) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <p className="text-red-600">{error || 'Incident non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link
              href="/incidents"
              className="text-indigo-600 hover:text-indigo-900"
            >
              ← Retour à la liste
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{incident.title}</h1>
          </div>
          <div className="flex space-x-3">
            <select
              value={incident.status}
              onChange={(e) => handleStatusChange(e.target.value as Incident['status'])}
              disabled={isUpdating}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="OPEN">Ouvert</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="RESOLVED">Résolu</option>
              <option value="CLOSED">Fermé</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Détails de l'incident
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Créé le {new Date(incident.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  incident.severity === 'CRITICAL'
                    ? 'bg-red-100 text-red-800'
                    : incident.severity === 'HIGH'
                    ? 'bg-orange-100 text-orange-800'
                    : incident.severity === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {incident.severity}
                </span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  incident.type === 'TECHNICAL'
                    ? 'bg-blue-100 text-blue-800'
                    : incident.type === 'SECURITY'
                    ? 'bg-red-100 text-red-800'
                    : incident.type === 'OPERATIONAL'
                    ? 'bg-yellow-100 text-yellow-800'
                    : incident.type === 'ENVIRONMENTAL'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {incident.type}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {incident.description}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Service</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {incident.department.name}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Assigné à</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {incident.assignedTo ? incident.assignedTo.name : 'Non assigné'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {incident.status}
                </dd>
              </div>
              {incident.resolvedAt && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Résolu le</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(incident.resolvedAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 