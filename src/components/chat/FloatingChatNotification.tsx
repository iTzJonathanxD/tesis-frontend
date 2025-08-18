'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, X, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { generateInitials } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatNotification {
  id: string;
  chatId: string;
  senderName: string;
  senderPhoto?: string;
  message: string;
  timestamp: string;
}

export function FloatingChatNotification() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Simular notificaciones de chat (en producción esto vendría de WebSocket o polling)
  useEffect(() => {
    if (!user) return;

    // Simular una notificación después de 5 segundos
    const timer = setTimeout(() => {
      const mockNotification: ChatNotification = {
        id: '1',
        chatId: 'chat-123',
        senderName: 'Ana García',
        message: 'Hola! Estoy interesada en tu servicio de diseño gráfico',
        timestamp: new Date().toISOString(),
      };

      setNotifications([mockNotification]);
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [user]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
    }
  };

  const dismissAll = () => {
    setNotifications([]);
    setIsVisible(false);
  };

  if (!user || notifications.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <Card className="p-4 shadow-2xl border-l-4 border-l-primary-500 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-900">
                  Nuevo mensaje
                </span>
                <Badge className="bg-primary-100 text-primary-800">
                  {notifications.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissAll}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {notification.senderPhoto ? (
                      <Image
                        src={notification.senderPhoto}
                        alt={notification.senderName}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {generateInitials(notification.senderName)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.senderName}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Hace unos momentos
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex space-x-2">
              <Link href="/dashboard/messages" className="flex-1">
                <Button size="sm" className="w-full">
                  Ver mensajes
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={dismissAll}
                className="px-3"
              >
                Cerrar
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
