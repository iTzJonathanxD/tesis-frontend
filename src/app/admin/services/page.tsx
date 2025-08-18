'use client';

import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Star,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Award,
} from 'lucide-react';
import { Service } from '@/types';
import { toast } from 'sonner';

export default function AdminServicesPage() {
  const {
    getServices,
    deleteService,
    toggleServiceActive,
    toggleServiceFeatured,
  } = useServices();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const services = getServices.data || [];

  const filteredServices = services.filter((service: Service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.seller.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && service.status === 'active') ||
      (filterStatus === 'inactive' && service.status === 'inactive');

    return matchesSearch && matchesFilter;
  });

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await deleteService.mutateAsync(serviceId);
        toast.success('Servicio eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar servicio');
      }
    }
  };

  const handleToggleActive = async (serviceId: string) => {
    try {
      await toggleServiceActive.mutateAsync(serviceId);
      toast.success('Estado del servicio actualizado');
    } catch (error) {
      toast.error('Error al actualizar estado del servicio');
    }
  };

  const handleToggleFeatured = async (serviceId: string) => {
    try {
      await toggleServiceFeatured.mutateAsync(serviceId);
      toast.success('Servicio destacado actualizado');
    } catch (error) {
      toast.error('Error al actualizar servicio destacado');
    }
  };

  if (getServices.isLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Servicios
          </h1>
          <p className="text-gray-600">
            Administra todos los servicios del sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar servicios..."
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service: Service) => (
          <Card key={service._id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              {service.images && service.images.length > 0 ? (
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sin imagen
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge
                  variant={
                    service.status === 'active' ? 'default' : 'secondary'
                  }
                >
                  {service.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {service.title}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-blue-600">
                  ${service.price}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">
                    {service.rating} ({service.totalReviews})
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                <div>Vendedor: {service.seller.name}</div>
                <div>Categoría: {service.category.name}</div>
                <div>Facultad: {service.faculty?.name}</div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(service._id)}
                  disabled={toggleServiceActive.isPending}
                  className="flex-1"
                >
                  {service.status === 'active' ? (
                    <ToggleRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 mr-1" />
                  )}
                  {service.status === 'active' ? 'Desactivar' : 'Activar'}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleFeatured(service._id)}
                  disabled={toggleServiceFeatured.isPending}
                >
                  <Award className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteService(service._id)}
                  disabled={deleteService.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron servicios</p>
        </div>
      )}
    </div>
  );
}
