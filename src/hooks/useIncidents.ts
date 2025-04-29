import { useState, useEffect } from 'react';

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

interface IncidentFilters {
  type?: string;
  severity?: string;
  status?: string;
  departmentId?: string;
}

export function useIncidents(filters: IncidentFilters = {}) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.severity) queryParams.append('severity', filters.severity);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.departmentId) queryParams.append('departmentId', filters.departmentId);

        const response = await fetch(`/api/incidents?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des incidents');
        }
        const data = await response.json();
        setIncidents(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des incidents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, [filters]);

  const createIncident = async (incidentData: Omit<Incident, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'resolvedAt'>) => {
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incidentData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'incident');
      }

      const newIncident = await response.json();
      setIncidents((prev) => [newIncident, ...prev]);
      return newIncident;
    } catch (err) {
      throw new Error('Une erreur est survenue lors de la création de l\'incident');
    }
  };

  return { incidents, isLoading, error, createIncident };
} 