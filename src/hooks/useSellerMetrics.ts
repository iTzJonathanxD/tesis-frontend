import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { SellerMetrics } from '@/types';

export const useSellerMetrics = () => {
  const getStatistics = useQuery({
    queryKey: ['seller-statistics'],
    queryFn: async () => {
      const response = await api.get('/seller-metrics/statistics');
      return response.data;
    },
  });

  const getTopServices = useQuery({
    queryKey: ['seller-top-services'],
    queryFn: async () => {
      const response = await api.get('/seller-metrics/top-services');
      return response.data;
    },
  });

  const getMonthlyEarnings = useQuery({
    queryKey: ['seller-monthly-earnings'],
    queryFn: async () => {
      const response = await api.get('/seller-metrics/monthly-earnings');
      return response.data;
    },
  });

  const getAllMetrics = useQuery({
    queryKey: ['seller-metrics'],
    queryFn: async (): Promise<SellerMetrics> => {
      const [statistics, topServices, monthlyEarnings] = await Promise.all([
        api.get('/seller-metrics/statistics'),
        api.get('/seller-metrics/top-services'),
        api.get('/seller-metrics/monthly-earnings'),
      ]);

      return {
        statistics: statistics.data,
        topServices: topServices.data,
        monthlyEarnings: monthlyEarnings.data,
      };
    },
  });

  return {
    getStatistics,
    getTopServices,
    getMonthlyEarnings,
    getAllMetrics,
    statistics: getStatistics.data,
    topServices: getTopServices.data,
    monthlyEarnings: getMonthlyEarnings.data,
    metrics: getAllMetrics.data,
    isLoading: getAllMetrics.isLoading,
  };
};
