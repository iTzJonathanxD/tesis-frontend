import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';
import { toast } from 'sonner';

// Helper function to safely access localStorage
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      removeTokens();
      queryClient.clear();
    },
  });

  const refreshToken = useMutation({
    mutationFn: async () => {
      const refresh_token = getRefreshToken();
      const response = await api.post('/auth/refresh', { refresh_token });
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
    },
  });

  const getProfile = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      const response = await api.get('/auth/profile');
      return response.data;
    },
    enabled: !!getAccessToken(),
  });

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await api.patch('/users/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const changePassword = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await api.patch('/auth/change-password', data);
      return response.data;
    },
  });

  const forgotPassword = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    },
  });

  const resetPassword = useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    },
  });

  const uploadProfilePhoto = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file); // Cambiar 'file' a 'photo' para coincidir con el backend
      const response = await api.post('/users/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Foto de perfil actualizada correctamente');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        'Error al actualizar la foto de perfil';
      toast.error(message);
    },
  });

  return {
    login,
    register,
    logout,
    refreshToken,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    uploadProfilePhoto,
    user: getProfile.data,
    isLoading: getProfile.isLoading,
    isAuthenticated: !!getProfile.data,
  };
};
