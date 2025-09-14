/**
 * Hooks personnalisés pour l'API iPresence
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, type Student, type Stats, type Presence, type Promotion, type Entity } from '@/lib/api';

// Hook pour récupérer les statistiques
export function useStats(startDate?: string, endDate?: string) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getStats(startDate, endDate);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Hook pour récupérer les étudiants
export function useStudents(params: {
  promotion_id?: number;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getStudents(params);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [params.promotion_id, params.search, params.limit, params.offset]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, loading, error, refetch: fetchStudents };
}

// Hook pour récupérer les présences
export function usePresences(params: {
  matricule?: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getPresences(params);
      setPresences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch presences');
    } finally {
      setLoading(false);
    }
  }, [params.matricule, params.date, params.start_date, params.end_date, params.limit, params.offset]);

  useEffect(() => {
    fetchPresences();
  }, [fetchPresences]);

  return { presences, loading, error, refetch: fetchPresences };
}

// Hook pour récupérer la structure académique
export function useStructure() {
  const [structure, setStructure] = useState<{ promotions: Promotion[]; entities: Entity[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStructure = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getStructure();
      setStructure(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch structure');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStructure();
  }, [fetchStructure]);

  return { structure, loading, error, refetch: fetchStructure };
}

// Hook pour marquer la présence
export function useMarkPresence() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markPresence = useCallback(async (data: {
    matricule: string;
    date?: string;
    time?: string;
    course_id?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.markPresence(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark presence';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { markPresence, loading, error };
}

// Hook pour rechercher un étudiant
export function useStudentSearch() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStudent = useCallback(async (matricule: string) => {
    if (!matricule.trim()) {
      setError('Matricule is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getStudent(matricule);
      setStudent(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Student not found';
      setError(errorMessage);
      setStudent(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearStudent = useCallback(() => {
    setStudent(null);
    setError(null);
  }, []);

  return { student, loading, error, searchStudent, clearStudent };
}