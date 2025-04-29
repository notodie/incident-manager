'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useIncidents } from '@/hooks/useIncidents';
import { useDepartments } from '@/hooks/useDepartments';

export default function IncidentsPage() {
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: '',
    departmentId: '',
  });

  const { incidents, isLoading: isLoadingIncidents, error: incidentsError } = useIncidents(filters);
  const { departments, isLoading: isLoadingDepartments, error: departmentsError } = useDepartments();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoadingIncidents || isLoadingDepartments) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (incidentsError || departmentsError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400">{incidentsError || departmentsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Incidents</h1>
        <Link
          href="/incidents/new"
          className="btn-primary"
        >
          Nouvel incident
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border-gray-600 text-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tous</option>
              <option value="TECHNICAL">Technique</option>
              <option value="SECURITY">Sécurité</option>
              <option value="OPERATIONAL">Opérationnel</option>
              <option value="ENVIRONMENTAL">Environnemental</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-300">
              Gravité
            </label>
            <select
              id="severity"
              name="severity"
              value={filters.severity}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border-gray-600 text-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tous</option>
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
              <option value="CRITICAL">Critique</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border-gray-600 text-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tous</option>
              <option value="OPEN">Ouvert</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="RESOLVED">Résolu</option>
              <option value="CLOSED">Fermé</option>
            </select>
          </div>
          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-300">
              Service
            </label>
            <select
              id="departmentId"
              name="departmentId"
              value={filters.departmentId}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm bg-gray-700 border-gray-600 text-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tous</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des incidents */}
      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <ul role="list" className="divide-y divide-gray-700">
          {incidents.length === 0 ? (
            <li className="px-6 py-4">
              <p className="text-gray-400">
                Aucun incident trouvé
              </p>
            </li>
          ) : (
            incidents.map((incident) => (
              <li key={incident.id} className="hover:bg-gray-700/50 transition-colors duration-150">
                <Link href={`/incidents/${incident.id}`} className="block px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-400 truncate">
                      {incident.title}
                    </p>
                    <div className="ml-2 flex-shrink-0">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        incident.severity === 'CRITICAL'
                          ? 'bg-red-900/30 text-red-400'
                          : incident.severity === 'HIGH'
                          ? 'bg-orange-900/30 text-orange-400'
                          : incident.severity === 'MEDIUM'
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-green-900/30 text-green-400'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <p className="flex items-center text-sm text-gray-400">
                      {incident.department.name}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-400 sm:mt-0">
                      Créé le {new Date(incident.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
} 