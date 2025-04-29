'use client';

import React from 'react';
import { 
  ChartBarIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

interface StatItem {
  id: number;
  name: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export default function Dashboard(): React.ReactElement {
  const stats: StatItem[] = [
    {
      id: 1,
      name: 'Incidents actifs',
      value: '0',
      icon: ExclamationCircleIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      id: 2,
      name: 'Incidents résolus',
      value: '0',
      icon: CheckCircleIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 3,
      name: 'Plans de continuité',
      value: '0',
      icon: ChartBarIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 4,
      name: 'Tâches en cours',
      value: '0',
      icon: ClockIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white overflow-hidden rounded-lg shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Incidents récents</h3>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Aucun incident récent</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Tâches à faire</h3>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Aucune tâche en attente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
