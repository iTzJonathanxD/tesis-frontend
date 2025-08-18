'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/types';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Star,
  Calendar,
  DollarSign,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useMyServices } from '@/hooks/useServices';
import { toast } from 'sonner';

const MyServices = () => {
  const { user } = useAuth();
  const { myServices: services, isLoading: loading } = useMyServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const servicesArray = Array.isArray(services) ? services : [];

  const filteredServices = servicesArray.filter((service: Service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Mapear isActive a status para compatibilidad
    const status = service.isActive ? 'active' : 'inactive';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const handleDeleteService = async (serviceId: string, title: string) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar "${title}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(serviceId);
      // TODO: Implement delete service functionality
      console.log('Delete service:', serviceId);
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setDeleteLoading(null);
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
            Debes iniciar sesión para ver tus servicios
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
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Mis Servicios
                </h1>
                <p className="text-gray-600 mt-1">
                  Gestiona todos tus servicios publicados
                </p>
              </div>
            </div>
            <Link href="/dashboard/services/create">
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Servicio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar servicios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <label htmlFor="status-filter" className="sr-only">
                    Filtrar por estado
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    aria-label="Filtrar servicios por estado"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                    <option value="pending">Pendientes</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all'
                ? 'No se encontraron servicios'
                : 'Aún no tienes servicios'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Crea tu primer servicio y comienza a generar ingresos con tus habilidades'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link href="/dashboard/services/create">
                <Button className="bg-primary-600 hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear tu primer servicio
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service: Service, index: number) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Service Image */}
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                    {service.images[0] ? (
                      <Image
                        src={service.images[0]}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={`${getStatusColor(
                          service.isActive ? 'active' : 'inactive'
                        )} border`}
                      >
                        {getStatusText(
                          service.isActive ? 'active' : 'inactive'
                        )}
                      </Badge>
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-1">
                        <Link href={`/services/${service._id}`}>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/services/${service._id}/edit`}>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          onClick={() =>
                            handleDeleteService(service._id, service.title)
                          }
                          disabled={deleteLoading === service._id}
                        >
                          {deleteLoading === service._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {service.title}
                      </h3>

                      {/* Category */}
                      <p className="text-sm text-gray-600">
                        {service.category.name}
                      </p>

                      {/* Rating and Reviews */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900 ml-1">
                            {(service.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({service.totalReviews || 0} reseñas)
                        </span>
                      </div>

                      {/* Price and Date */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-primary-600" />
                          <span className="font-bold text-primary-600 text-lg">
                            {service.price}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(service.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && filteredServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {services.length}
                    </p>
                    <p className="text-sm text-gray-600">Total de servicios</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        services.filter((s: Service) => s.isActive === true)
                          .length
                      }
                    </p>
                    <p className="text-sm text-gray-600">Servicios activos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {services.reduce(
                        (acc: number, s: Service) =>
                          acc + (s.totalReviews || 0),
                        0
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Total de reseñas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600">
                      {services.length > 0
                        ? (
                            services.reduce(
                              (acc: number, s: Service) =>
                                acc + (s.rating || 0),
                              0
                            ) / services.length
                          ).toFixed(1)
                        : '0.0'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Calificación promedio
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
