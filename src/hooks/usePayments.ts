import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Payment,
  CreatePaymentRequest,
  PaymentStatistics,
  PaginatedResponse,
} from '@/types';

export const usePayments = () => {
  const queryClient = useQueryClient();

  const createPayment = useMutation({
    mutationFn: async (data: CreatePaymentRequest): Promise<Payment> => {
      const response = await api.post('/payments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const confirmPayment = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/payments/${id}/confirm`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const rejectPayment = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/payments/${id}/reject`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const getPayments = useQuery({
    queryKey: ['payments'],
    queryFn: async (): Promise<PaginatedResponse<Payment>> => {
      const response = await api.get('/payments');
      return response.data;
    },
  });

  const getMyPayments = useQuery({
    queryKey: ['my-payments'],
    queryFn: async (): Promise<PaginatedResponse<Payment>> => {
      const response = await api.get('/payments/my-payments');
      return response.data;
    },
  });

  const getPaymentStatistics = useQuery({
    queryKey: ['payment-statistics'],
    queryFn: async (): Promise<PaymentStatistics> => {
      const response = await api.get('/payments/statistics');
      return response.data;
    },
  });

  const getPaymentById = (id: string) =>
    useQuery({
      queryKey: ['payment', id],
      queryFn: async (): Promise<Payment> => {
        const response = await api.get(`/payments/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  const updatePayment = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Payment>;
    }) => {
      const response = await api.patch(`/payments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  return {
    createPayment,
    confirmPayment,
    rejectPayment,
    getPayments,
    getMyPayments,
    getPaymentStatistics,
    getPaymentById,
    updatePayment,
    payments: getPayments.data?.data.items || [],
    myPayments: getMyPayments.data?.data.items || [],
    statistics: getPaymentStatistics.data,
    isLoading: getPayments.isLoading,
  };
};
