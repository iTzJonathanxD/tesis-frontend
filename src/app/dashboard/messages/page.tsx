'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MessageCircle,
  Search,
  Users,
  Package,
  AlertCircle,
} from 'lucide-react';

interface Chat {
  _id: string;
  buyer: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  seller: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  service: {
    title: string;
    images: string[];
  };
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isActive: boolean;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/chats');
        const chatData =
          response.data?.data?.items ||
          response.data?.data ||
          response.data ||
          [];

        // Asegurar que chatData es un array
        setChats(Array.isArray(chatData) ? chatData : []);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Error al cargar conversaciones'
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user]);

  const filteredChats = Array.isArray(chats)
    ? chats.filter((chat) => {
        if (!searchTerm) return true;

        const otherUser =
          chat.buyer._id === user?._id ? chat.seller : chat.buyer;
        return (
          otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.service.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  const getOtherUser = (chat: Chat) => {
    return chat.buyer._id === user?._id ? chat.seller : chat.buyer;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para ver tus mensajes
          </p>
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mensajes</h1>
                <p className="text-gray-600 mt-1">
                  Gestiona tus conversaciones con compradores y vendedores
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Conversaciones ({filteredChats.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Error al Cargar Mensajes
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Intentar de Nuevo
                </Button>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm
                    ? 'No se encontraron conversaciones'
                    : 'No tienes conversaciones'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? `No hay conversaciones que coincidan con "${searchTerm}"`
                    : 'Las conversaciones aparecerán aquí cuando compres o vendas servicios'}
                </p>
                {!searchTerm && (
                  <Link href="/services">
                    <Button>Explorar Servicios</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredChats.map((chat, index) => {
                  const otherUser = getOtherUser(chat);
                  return (
                    <motion.div
                      key={chat._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        {/* User Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                            {otherUser.profilePhoto ? (
                              <Image
                                src={otherUser.profilePhoto}
                                alt={otherUser.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          {chat.unreadCount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                              {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                            </div>
                          )}
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {otherUser.name}
                            </h4>
                            {chat.lastMessageAt && (
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  chat.lastMessageAt
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 truncate mb-1">
                            Sobre: {chat.service.title}
                          </p>

                          {chat.lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                              {chat.lastMessage}
                            </p>
                          )}
                        </div>

                        {/* Service Image */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {chat.service.images?.[0] ? (
                            <Image
                              src={chat.service.images[0]}
                              alt={chat.service.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          <Link href={`/dashboard/messages/${chat._id}`}>
                            <Button size="sm" className="w-full">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Abrir
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
