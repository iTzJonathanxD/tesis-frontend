import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { UploadResponse, ImageTransform, ImageVariant } from '@/types';

export const useUpload = () => {
  const uploadImage = useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  });

  const uploadImages = useMutation({
    mutationFn: async (files: File[]): Promise<UploadResponse[]> => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      const response = await api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (publicId: string) => {
      const response = await api.delete(`/upload/image/${publicId}`);
      return response.data;
    },
  });

  const deleteImages = useMutation({
    mutationFn: async (publicIds: string[]) => {
      const response = await api.delete('/upload/images', {
        data: { publicIds },
      });
      return response.data;
    },
  });

  const getImageInfo = (publicId: string) =>
    useQuery({
      queryKey: ['image-info', publicId],
      queryFn: async () => {
        const response = await api.get(`/upload/image/${publicId}/info`);
        return response.data;
      },
      enabled: !!publicId,
    });

  const transformImage = useMutation({
    mutationFn: async ({
      publicId,
      transform,
    }: {
      publicId: string;
      transform: ImageTransform;
    }) => {
      const response = await api.post(
        `/upload/image/${publicId}/transform`,
        transform
      );
      return response.data;
    },
  });

  const getImageVariants = (publicId: string) =>
    useQuery({
      queryKey: ['image-variants', publicId],
      queryFn: async (): Promise<ImageVariant[]> => {
        const response = await api.get(`/upload/image/${publicId}/variants`);
        return response.data;
      },
      enabled: !!publicId,
    });

  return {
    uploadImage,
    uploadImages,
    deleteImage,
    deleteImages,
    getImageInfo,
    transformImage,
    getImageVariants,
  };
};
