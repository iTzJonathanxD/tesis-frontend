import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { AdminUser, UserMetrics, PaginatedResponse } from '@/types';

export const useUsers = () => {
  const queryClient = useQueryClient();

  const getUsers = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<PaginatedResponse<AdminUser>> => {
      const response = await api.get('/users');
      const backendData = response.data;

      // If it's an array, adapt it
      if (Array.isArray(backendData)) {
        return {
          success: true,
          data: {
            items: backendData,
            total: backendData.length,
            page: 1,
            totalPages: 1,
          },
        };
      }

      // If it's already paginated, adapt it
      return {
        success: true,
        data: {
          items: backendData.users || backendData.data?.items || [],
          total:
            backendData.pagination?.totalItems || backendData.data?.total || 0,
          page:
            backendData.pagination?.currentPage || backendData.data?.page || 1,
          totalPages:
            backendData.pagination?.totalPages ||
            backendData.data?.totalPages ||
            1,
        },
      };
    },
  });

  const getUserById = (id: string) =>
    useQuery({
      queryKey: ['user', id],
      queryFn: async (): Promise<AdminUser> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  const getUserMetrics = useQuery({
    queryKey: ['user-metrics'],
    queryFn: async (): Promise<UserMetrics> => {
      const response = await api.get('/users/metrics');
      return response.data;
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AdminUser>;
    }) => {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const verifyUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/users/${id}/verify`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deactivateUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/users/${id}/deactivate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const activateUser = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/users/${id}/activate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    getUsers,
    getUserById,
    getUserMetrics,
    updateUser,
    deleteUser,
    verifyUser,
    deactivateUser,
    activateUser,
    users: getUsers.data?.data.items || [],
    isLoading: getUsers.isLoading,
  };
};
