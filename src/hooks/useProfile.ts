import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';

interface UpdateProfileData {
  name?: string;
  profilePhoto?: string;
  description?: string;
  socialNetworks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useProfile = () => {
  const queryClient = useQueryClient();

  const getProfile = useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<User> => {
      const response = await api.get('/auth/profile');
      return response.data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await api.patch('/auth/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const changePassword = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const response = await api.patch('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      return response.data;
    },
  });

  const uploadProfilePhoto = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Automatically update profile with new photo URL
      updateProfile.mutate({ profilePhoto: data.url });
    },
  });

  return {
    profile: getProfile.data,
    isLoading: getProfile.isLoading,
    updateProfile,
    changePassword,
    uploadProfilePhoto,
    refetch: getProfile.refetch,
  };
};
