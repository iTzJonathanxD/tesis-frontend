'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Faculty {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Career {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  faculty: {
    _id: string;
    name: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const useFaculties = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/academic/faculties');
        setFaculties(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar facultades');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  return { faculties, loading, error };
};

export const useCareers = (facultyId?: string) => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset careers when facultyId changes
    setCareers([]);
    setError(null);

    // Only fetch careers if facultyId is provided and not empty
    if (!facultyId || facultyId.trim() === '') {
      setLoading(false);
      return;
    }

    const fetchCareers = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching careers for faculty:', facultyId); // Debug log

        // Try both endpoints to see which one works
        let response;
        try {
          response = await api.get(`/academic/careers?facultyId=${facultyId}`);
        } catch (firstError) {
          console.log('First endpoint failed, trying alternative:', firstError);
          response = await api.get(`/academic/careers/faculty/${facultyId}`);
        }

        console.log('Careers response:', response.data); // Debug log

        // Handle different response formats
        const careersData = Array.isArray(response.data)
          ? response.data
          : response.data.careers || [];
        setCareers(careersData);

        if (careersData.length === 0) {
          console.log('No careers found for faculty:', facultyId);
        }
      } catch (err: any) {
        console.error('Error fetching careers:', err); // Debug log
        setError(
          err.response?.data?.message ||
            err.message ||
            'Error al cargar carreras'
        );
        setCareers([]);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to avoid rapid API calls
    const timeoutId = setTimeout(fetchCareers, 100);

    return () => clearTimeout(timeoutId);
  }, [facultyId]);

  return { careers, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/academic/categories');
        setCategories(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Combined hook for academic data
export const useAcademic = () => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [facultiesResponse, careersResponse] = await Promise.all([
          api.get('/academic/faculties'),
          api.get('/academic/careers'),
        ]);

        setFaculties(facultiesResponse.data);
        setCareers(careersResponse.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos académicos');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicData();
  }, []);

  const createFaculty = {
    mutateAsync: async (data: Omit<Faculty, '_id'>) => {
      try {
        const response = await api.post('/academic/faculties', data);
        setFaculties((prev) => [...prev, response.data]);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
  };

  const updateFaculty = {
    mutateAsync: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Faculty>;
    }) => {
      try {
        const response = await api.patch(`/academic/faculties/${id}`, data);
        setFaculties((prev) =>
          prev.map((f) => (f._id === id ? response.data : f))
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
  };

  const deleteFaculty = {
    mutateAsync: async (id: string) => {
      try {
        await api.delete(`/academic/faculties/${id}`);
        setFaculties((prev) => prev.filter((f) => f._id !== id));
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
  };

  const createCareer = {
    mutateAsync: async (
      data: Omit<Career, '_id' | 'faculty'> & { facultyId: string }
    ) => {
      try {
        const response = await api.post('/academic/careers', data);
        setCareers((prev) => [...prev, response.data]);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
  };

  const updateCareer = {
    mutateAsync: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Career> & { facultyId?: string };
    }) => {
      try {
        const response = await api.patch(`/academic/careers/${id}`, data);
        setCareers((prev) =>
          prev.map((c) => (c._id === id ? response.data : c))
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
  };

  const deleteCareer = {
    mutateAsync: async (id: string) => {
      try {
        await api.delete(`/academic/careers/${id}`);
        setCareers((prev) => prev.filter((c) => c._id !== id));
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
  };

  const seedAcademicData = {
    mutateAsync: async () => {
      try {
        await api.post('/academic/admin/seed');
        // Refresh data after seeding
        const [facultiesResponse, careersResponse] = await Promise.all([
          api.get('/academic/faculties'),
          api.get('/academic/careers'),
        ]);
        setFaculties(facultiesResponse.data);
        setCareers(careersResponse.data);
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
  };

  const clearAcademicData = {
    mutateAsync: async () => {
      try {
        await api.delete('/academic/admin/clear');
        setFaculties([]);
        setCareers([]);
      } catch (error) {
        throw error;
      }
    },
    isPending: false,
  };

  return {
    faculties,
    careers,
    loading,
    error,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    createCareer,
    updateCareer,
    deleteCareer,
    seedAcademicData,
    clearAcademicData,
    isLoading: loading,
  };
};
