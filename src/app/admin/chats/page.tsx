'use client';

import { useState } from 'react';
import { useChats } from '@/hooks/useChats';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Eye, Ban, Clock, User } from 'lucide-react';
import { Chat } from '@/types';
import { toast } from 'sonner';

export default function AdminChatsPage() {
  const { chats, deactivateChat, isLoading } = useChats();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const filteredChats = chats.filter((chat: Chat) => {
    const matchesSearch =
      chat.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.service.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && chat.isActive) ||
      (filterStatus === 'inactive' && !chat.isActive);

    return matchesSearch && matchesFilter;
  });

  const handleDeactivateChat = async (chatId: string) => {
    if (confirm('¿Estás seguro de que quieres desactivar este chat?')) {
      try {
        await deactivateChat.mutateAsync(chatId);
        toast.success('Chat desactivado exitosamente');
      } catch (error) {
        toast.error('Error al desactivar chat');
      }
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Chats</h1>
          <p className="text-gray-600">
            Administra las conversaciones del sistema
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Chats</p>
              <p className="text-2xl font-semibold text-gray-900">
                {chats.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Chats Activos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {chats.filter((c) => c.isActive).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Con Mensajes No Leídos
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {chats.filter((c) => c.unreadCount > 0).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('active')}
              size="sm"
            >
              Activos
            </Button>
            <Button
              variant={filterStatus === 'inactive' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('inactive')}
              size="sm"
            >
              Inactivos
            </Button>
          </div>
        </div>
      </Card>

      {/* Chats List */}
      <div className="space-y-4">
        {filteredChats.map((chat: Chat) => (
          <Card key={chat._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {chat.buyer.name}
                      </p>
                      <p className="text-xs text-gray-500">Comprador</p>
                    </div>
                  </div>

                  <div className="text-gray-400">↔</div>

                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {chat.seller.name}
                      </p>
                      <p className="text-xs text-gray-500">Vendedor</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {chat.service.title}
                  </h3>
                  {chat.lastMessage && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 mb-1">
                        Último mensaje:
                      </p>
                      <p className="text-sm text-gray-900">
                        {chat.lastMessage}
                      </p>
                      {chat.lastMessageAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(chat.lastMessageAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant={chat.isActive ? 'default' : 'secondary'}>
                    {chat.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  {chat.unreadCount > 0 && (
                    <Badge variant="destructive">
                      {chat.unreadCount} no leídos
                    </Badge>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Chat #{chat._id.slice(-8)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                {chat.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeactivateChat(chat._id)}
                    disabled={deactivateChat.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Desactivar
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredChats.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron chats</p>
        </div>
      )}
    </div>
  );
}
