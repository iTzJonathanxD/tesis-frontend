'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Eye,
  Star,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Users,
  MessageSquare,
  Share2,
  Heart,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useServices } from '@/hooks/useServices';
import { toast } from 'sonner';

const ServiceView = () => {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  const { user } = useAuth();
  const { getServiceById } = useServices();

  if (!serviceId || serviceId === 'undefined') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ID de servicio inválido
        </h1>
        <Link href="/dashboard/services">
          <Button>Volver a mis servicios</Button>
        </Link>
      </div>
    );
  }

  const serviceQuery = getServiceById(serviceId);
  const service = serviceQuery.data;

  const handleShare = () => {
    const url = `${window.location.origin}/services/${serviceId}`;
    navigator.clipboard.writeText(url);
    toast.success('Enlace copiado al portapapeles');
  };

  const handleToggleActive = async () => {
    try {
      // TODO: Implement toggle service active functionality
      toast.success('Estado del servicio actualizado');
    } catch (error) {
      toast.error('Error al actualizar el estado del servicio');
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
            Debes iniciar sesión para ver este servicio
          </p>
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (serviceQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Servicio no encontrado
        </h1>
        <Link href="/dashboard/services">
          <Button>Volver a mis servicios</Button>
        </Link>
      </div>
    );
  }

  // Verificar que el usuario es el propietario del servicio
  const isOwner = user._id === service.seller._id;

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acceso Denegado
        </h1>
        <p className="text-gray-600 mb-6">
          No tienes permisos para ver este servicio
        </p>
        <Link href="/dashboard/services">
          <Button>Volver a mis servicios</Button>
        </Link>
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
              <Link href="/dashboard/services">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Mis Servicios
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {service.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  Vista previa de tu servicio
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href={`/dashboard/services/${serviceId}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Link href={`/services/${serviceId}`}>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Público
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                  {service.images && service.images.length > 0 ? (
                    <Image
                      src={service.images[0]}
                      alt={service.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                      <p className="text-gray-500 mt-2">Sin imagen</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Service Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            className={`${
                              service.isActive
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            } border`}
                          >
                            {service.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                          <span className="text-3xl font-bold text-primary-600">
                            ${service.price}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {service.seller?.facultyId?.name ||
                              'No especificada'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(service.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {service.viewCount || 0} vistas
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-medium">
                            {(service.rating || 0).toFixed(1)}
                          </span>
                          <span className="text-gray-600">
                            ({service.totalReviews || 0} reseñas)
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Descripción
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {service.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          Categoría:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {service.category?.name || 'No especificada'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Carrera:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {service.seller?.careerId?.name || 'No especificada'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Service Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vistas:</span>
                      <span className="font-medium">
                        {service.viewCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Reseñas:</span>
                      <span className="font-medium">
                        {service.totalReviews || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Calificación:</span>
                      <span className="font-medium">
                        {(service.rating || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span
                        className={`font-medium ${
                          service.isActive ? 'text-green-600' : 'text-gray-600'
                        }`}
                      >
                        {service.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Acciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href={`/dashboard/services/${serviceId}/edit`}>
                      <Button className="w-full" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Servicio
                      </Button>
                    </Link>
                    <Button
                      className="w-full"
                      variant={service.isActive ? 'secondary' : 'default'}
                      onClick={handleToggleActive}
                    >
                      {service.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Link href={`/services/${serviceId}`}>
                      <Button className="w-full" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver como Cliente
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Additional Images */}
              {service.images && service.images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Más Imágenes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {service.images.slice(1).map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={image}
                              alt={`${service.title} - imagen ${index + 2}`}
                              width={150}
                              height={150}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceView;
