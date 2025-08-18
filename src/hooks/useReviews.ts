import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Review, CreateReviewRequest, PaginatedResponse } from '@/types';

export const useReviews = () => {
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: async (data: CreateReviewRequest): Promise<Review> => {
      const response = await api.post('/reviews', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const getReviews = useQuery({
    queryKey: ['reviews'],
    queryFn: async (): Promise<PaginatedResponse<Review>> => {
      const response = await api.get('/reviews');
      return response.data;
    },
  });

  const getMyReviews = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async (): Promise<PaginatedResponse<Review>> => {
      try {
        const response = await api.get('/reviews/my-reviews');
        return response.data;
      } catch (error) {
        console.error('Error fetching my reviews:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const getServiceReviews = (serviceId: string) =>
    useQuery({
      queryKey: ['service-reviews', serviceId],
      queryFn: async (): Promise<{
        reviews: Review[];
        total: number;
        page: number;
        totalPages: number;
      }> => {
        const response = await api.get(`/reviews/service/${serviceId}`);
        return response.data;
      },
      enabled: !!serviceId,
    });

  const canReviewService = (serviceId: string) =>
    useQuery({
      queryKey: ['can-review', serviceId],
      queryFn: async (): Promise<{
        canReview: boolean;
        reason?: string;
        orderId?: string;
      }> => {
        try {
          const response = await api.get(`/reviews/can-review/${serviceId}`);
          return response.data;
        } catch (error) {
          console.error('Error checking review permission:', error);
          // Retornar un valor por defecto en caso de error
          return { canReview: false, reason: 'Error al verificar permisos' };
        }
      },
      enabled: !!serviceId,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    });

  const getReviewById = (id: string) =>
    useQuery({
      queryKey: ['review', id],
      queryFn: async (): Promise<Review> => {
        const response = await api.get(`/reviews/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  const updateReview = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateReviewRequest>;
    }) => {
      const response = await api.patch(`/reviews/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/reviews/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  return {
    createReview,
    getReviews,
    getMyReviews,
    getServiceReviews,
    canReviewService,
    getReviewById,
    updateReview,
    deleteReview,
    reviews: getReviews.data?.data?.items || [],
    myReviews: getMyReviews.data?.data?.items || [],
    isLoading: getReviews.isLoading,
  };
};
