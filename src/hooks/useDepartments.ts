import { useState, useEffect } from 'react';

interface Department {
  id: string;
  name: string;
  description: string | null;
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des services');
        }
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, isLoading, error };
} 