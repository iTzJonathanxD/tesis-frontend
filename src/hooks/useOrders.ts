'use client';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface OrderService {
  _id: string;
  title: string;
  price: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface OrderData {
  _id: string;
  service: OrderService;
  buyer: OrderUser;
  seller: OrderUser;
  status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  serviceId: string;
  message?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: 'buyer' | 'seller';
}

export const useOrders = (filters?: OrderFilters) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine the endpoint based on type
      let endpoint = '/orders';
      if (filters?.type === 'buyer') {
        endpoint = '/orders/my-purchases';
      } else if (filters?.type === 'seller') {
        endpoint = '/orders/my-sales';
      }

      // Build query parameters (excluding type since it's now part of the endpoint)
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && key !== 'type') {
            params.append(key, value.toString());
          }
        });
      }

      const response = await api.get(`${endpoint}?${params.toString()}`);
      const responseData = response.data.data || response.data;
      const {
        orders: orderData,
        total: totalCount,
        totalPages: pages,
      } = responseData;
      setOrders(orderData || []); // Ensure orderData is an array, even if null/undefined
      setTotal(totalCount || 0);
      setTotalPages(pages || 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar órdenes');
      setOrders([]); // Ensure orders is an array on error
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [JSON.stringify(filters)]);

  const createOrder = useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const response = await api.post('/orders', data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      toast.success('Orden creada exitosamente');
      fetchOrders(); // Refresh the list
    },
    onError: (err: any) => {
      const message = err.message || 'Error al crear la orden';
      toast.error(message);
    },
  });

  return {
    orders,
    loading,
    error,
    total,
    totalPages,
    createOrder,
    getOrders: fetchOrders,
    refetch: fetchOrders,
  };
};

export const useOrder = (id: string) => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.data || response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la orden');
        setOrder(null); // Ensure order is null on error
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id]);

  return { order, loading, error };
};
