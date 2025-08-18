import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Chat, Message, PaginatedResponse } from '@/types';

export const useChats = () => {
  const queryClient = useQueryClient();

  const createChat = useMutation({
    mutationFn: async (data: {
      serviceId: string;
      message: string;
    }): Promise<Chat> => {
      const response = await api.post('/chats/from-service', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({
      chatId,
      content,
      messageType = 'text',
    }: {
      chatId: string;
      content: string;
      messageType?: 'text' | 'image';
    }): Promise<Message> => {
      const response = await api.post(`/chats/${chatId}/messages`, {
        content,
        messageType,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chat-messages', variables.chatId],
      });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  const getChats = useQuery({
    queryKey: ['chats'],
    queryFn: async (): Promise<Chat[]> => {
      const response = await api.get('/chats');
      return response.data;
    },
  });

  const getUnreadCount = useQuery({
    queryKey: ['unread-count'],
    queryFn: async (): Promise<{ count: number }> => {
      const response = await api.get('/chats/unread-count');
      return response.data;
    },
  });

  const getChatById = (id: string) =>
    useQuery({
      queryKey: ['chat', id],
      queryFn: async (): Promise<Chat> => {
        const response = await api.get(`/chats/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  const getChatMessages = (chatId: string) =>
    useQuery({
      queryKey: ['chat-messages', chatId],
      queryFn: async (): Promise<PaginatedResponse<Message>> => {
        const response = await api.get(`/chats/${chatId}/messages`);
        return response.data;
      },
      enabled: !!chatId,
    });

  const markChatAsRead = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await api.patch(`/chats/${chatId}/mark-read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const deactivateChat = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await api.patch(`/chats/${chatId}/deactivate`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  return {
    createChat,
    sendMessage,
    getChats,
    getUnreadCount,
    getChatById,
    getChatMessages,
    markChatAsRead,
    deactivateChat,
    chats: getChats.data || [],
    unreadCount: getUnreadCount.data?.count || 0,
    isLoading: getChats.isLoading,
  };
};
