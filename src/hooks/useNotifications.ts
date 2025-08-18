'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Notification {
  _id: string;
  userId: string;
  type: 'order' | 'payment' | 'review' | 'chat' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  phoneNumber?: string;
  notificationTypes: {
    orders: boolean;
    payments: boolean;
    reviews: boolean;
    chats: boolean;
    system: boolean;
  };
}

export const useNotifications = (page = 1, limit = 20) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/notifications?page=${page}&limit=${limit}`
      );
      const data = response.data;

      setNotifications(data.notifications || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
      setUnreadCount(data.unreadCount || 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar notificaciones');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, limit]);

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success('Notificación marcada como leída');
    } catch (err: any) {
      toast.error('Error al marcar como leída');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (err: any) {
      toast.error('Error al marcar todas como leídas');
    }
  };

  return {
    notifications,
    loading,
    error,
    total,
    totalPages,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/notifications/preferences');
      setPreferences(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar preferencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const updatePreferences = async (
    updates: Partial<NotificationPreferences>
  ) => {
    try {
      const response = await api.put('/notifications/preferences', updates);
      setPreferences(response.data);
      toast.success('Preferencias actualizadas');
      return response.data;
    } catch (err: any) {
      toast.error('Error al actualizar preferencias');
      throw err;
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences,
  };
};

export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      // Try to get unread count from notifications or chats endpoint
      const response = await api.get('/chats/unread-count');
      setUnreadCount(response.data?.unreadCount || response.data?.count || 0);
    } catch (err: any) {
      console.error(
        'Error fetching unread count:',
        err?.response?.data || err?.message || 'Unknown error'
      );
      // Try alternative endpoint if the first one fails
      try {
        const altResponse = await api.get('/notifications/unread-count');
        setUnreadCount(
          altResponse.data?.unreadCount || altResponse.data?.count || 0
        );
      } catch (altErr) {
        console.error('Alternative unread count failed:', altErr);
        setUnreadCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Poll for updates every 10 seconds for more real-time updates
    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    unreadCount,
    loading,
    refetch: fetchUnreadCount,
  };
};
