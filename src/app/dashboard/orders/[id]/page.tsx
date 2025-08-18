'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Users,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface Order {
  _id: string;
  service: {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
  };
  buyer: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  seller: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  status: string;
  totalAmount: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params?.id as string;
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || orderId === 'undefined') {
        setError('ID de orden no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data?.data || response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Error al cargar la orden'
        );
      } finally {
        setLoading(false);
      }
    };

    if (user && orderId) {
      fetchOrder();
    }
  }, [user, orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para ver esta orden
          </p>
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!orderId || orderId === 'undefined') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Orden No Encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            La orden que buscas no existe o no tienes permisos para verla.
          </p>
          <Link href="/dashboard/orders">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Órdenes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error al Cargar Orden
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Intentar de Nuevo
            </Button>
            <Link href="/dashboard/orders">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Órdenes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Orden No Encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudo encontrar la orden solicitada.
          </p>
          <Link href="/dashboard/orders">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Órdenes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user._id === order.buyer._id || user._id === order.seller._id;
  const isBuyer = user._id === order.buyer._id;
  const isSeller = user._id === order.seller._id;

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para ver esta orden.
          </p>
          <Link href="/dashboard/orders">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Órdenes
            </Button>
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
              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Orden #{order._id.slice(-8)}
                </h1>
                <p className="text-gray-600 mt-1">
                  Detalles de la orden de servicio
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(order.status)} variant="secondary">
              {getStatusIcon(order.status)}
              <span className="ml-2 capitalize">
                {getStatusText(order.status)}
              </span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Información del Servicio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {order.service.images?.[0] ? (
                        <Image
                          src={order.service.images[0]}
                          alt={order.service.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {order.service.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {order.service.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-primary-600">
                          ${order.service.price}
                        </span>
                        <Link href={`/services/${order.service._id}`}>
                          <Button variant="outline" size="sm">
                            Ver Servicio
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Message */}
            {order.message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Mensaje del Comprador</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      "{order.message}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Participants */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Participantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Buyer */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                      {order.buyer.profilePhoto ? (
                        <Image
                          src={order.buyer.profilePhoto}
                          alt={order.buyer.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.buyer.name}
                        {isBuyer && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Tú)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">Comprador</p>
                    </div>
                  </div>

                  {/* Seller */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                      {order.seller.profilePhoto ? (
                        <Image
                          src={order.seller.profilePhoto}
                          alt={order.seller.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.seller.name}
                        {isSeller && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Tú)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">Vendedor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Resumen de Orden
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${order.service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comisión:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-bold text-primary-600">
                        ${order.totalAmount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Cronología
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Orden creada</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {order.updatedAt !== order.createdAt && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">
                          Última actualización
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/dashboard/messages?order=${order._id}`}>
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </Link>

                  {order.status === 'completed' && isBuyer && (
                    <Link
                      href={`/services/${order.service._id}?review=true&order=${order._id}`}
                    >
                      <Button variant="outline" className="w-full">
                        Dejar Reseña
                      </Button>
                    </Link>
                  )}

                  {order.status === 'pending' && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200"
                    >
                      Cancelar Orden
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
