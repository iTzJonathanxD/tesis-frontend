'use client';

import { useState } from 'react';
import { useChats } from '@/hooks/useChats';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  Search,
  User,
  Clock,
  Image as ImageIcon,
} from 'lucide-react';
import { Chat, Message } from '@/types';
import { toast } from 'sonner';

export default function ChatsPage() {
  const {
    chats,
    getChatMessages,
    sendMessage,
    markChatAsRead,
    unreadCount,
    isLoading,
  } = useChats();

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(
    (chat) =>
      chat.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const messagesQuery = selectedChat ? getChatMessages(selectedChat.id) : null;
  const messages = messagesQuery?.data?.data.items || [];

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    if (chat.unreadCount > 0) {
      try {
        await markChatAsRead.mutateAsync(chat.id);
      } catch (error) {
        console.error('Error marking chat as read:', error);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !messageText.trim()) return;

    try {
      await sendMessage.mutateAsync({
        chatId: selectedChat.id,
        content: messageText.trim(),
        messageType: 'text',
      });
      setMessageText('');
    } catch (error) {
      toast.error('Error al enviar mensaje');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Conversaciones
            </h2>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} no leídos</Badge>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No tienes conversaciones</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?._id === chat._id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {/* Show the other person's name */}
                          {chat.buyer._id === user?._id
                            ? chat.seller.name
                            : chat.buyer.name}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.service.title}
                      </p>
                      {chat.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                      )}
                      {chat.lastMessageAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(chat.lastMessageAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedChat.buyer._id === user?._id
                      ? selectedChat.seller.name
                      : selectedChat.buyer.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedChat.service.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No hay mensajes en esta conversación</p>
                  <p className="text-sm">¡Envía el primer mensaje!</p>
                </div>
              ) : (
                messages.map((message: Message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender._id === user?._id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender._id === user?._id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {message.messageType === 'image' ? (
                        <div className="space-y-2">
                          <ImageIcon className="h-4 w-4" />
                          <p className="text-sm">Imagen</p>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs ${
                            message.sender._id === user?._id
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                        {message.sender._id === user?._id && (
                          <div
                            className={`text-xs ${
                              message.isRead ? 'text-blue-100' : 'text-blue-200'
                            }`}
                          >
                            {message.isRead ? '✓✓' : '✓'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!messageText.trim() || sendMessage.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona una conversación
              </h3>
              <p>Elige un chat de la lista para comenzar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
