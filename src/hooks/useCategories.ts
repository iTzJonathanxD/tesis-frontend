import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category } from '@/types';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const getCategories = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const response = await api.get('/academic/categories');
      return response.data;
    },
  });

  const getCategoryById = (id: string) =>
    useQuery({
      queryKey: ['category', id],
      queryFn: async (): Promise<Category> => {
        const response = await api.get(`/academic/categories/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  const getCategoryByName = (name: string) =>
    useQuery({
      queryKey: ['category-name', name],
      queryFn: async (): Promise<Category> => {
        const response = await api.get(`/academic/categories/name/${name}`);
        return response.data;
      },
      enabled: !!name,
    });

  const createCategory = useMutation({
    mutationFn: async (data: Omit<Category, 'id'>) => {
      const response = await api.post('/academic/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Category>;
    }) => {
      const response = await api.patch(`/academic/categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/academic/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    getCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory,
    categories: getCategories.data || [],
    isLoading: getCategories.isLoading,
  };
};
