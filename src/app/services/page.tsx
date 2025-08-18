'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Star,
  Heart,
  User,
  Package,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePaginatedServices } from '@/hooks/useServices'; // Corrected import
import { useAcademic } from '@/hooks/useAcademic';
import { useCategories } from '@/hooks/useCategories';
import type { ServiceFilters, Service } from '@/types';
import { AuthInfoBanner } from '@/components/auth/auth-info-banner';

// Agregar estilos personalizados
const customStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

const ServicesPage = () => {
  const [filters, setFilters] = useState<ServiceFilters>({
    search: '',
    categoryId: '',
    facultyId: '',
    careerId: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Use the new usePaginatedServices hook directly
  const servicesQuery = usePaginatedServices(filters);

  const { faculties, careers } = useAcademic();
  const { categories } = useCategories();

  const services = servicesQuery.data?.data?.items ?? [];
  const total = servicesQuery.data?.data?.total ?? 0;
  const totalPages = servicesQuery.data?.data?.totalPages ?? 0;
  const loading = servicesQuery.isLoading;

  const handleFilterChange = (
    key: keyof ServiceFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
    if (key === 'facultyId') {
      setFilters((prev) => ({ ...prev, careerId: '' })); // Reset career
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      facultyId: '',
      careerId: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 12,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Inyectar estilos personalizados */}
      <style jsx>{customStyles}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Encuentra el servicio perfecto para tu proyecto
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Conecta con estudiantes talentosos de ULEAM especializados en
                diferentes áreas
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>{total} servicios disponibles</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Estudiantes verificados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Auth Info Banner */}
        <AuthInfoBanner />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Más compacto */}
          <div className="lg:w-72">
            <div className="sticky top-4">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="w-full"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                </Button>
              </div>
              <div
                className={`space-y-4 ${
                  showFilters ? 'block' : 'hidden lg:block'
                }`}
              >
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                      <SlidersHorizontal className="h-4 w-4 mr-2 text-blue-600" />
                      Filtros de Búsqueda
                    </h3>
                    {/* Search */}
                    <div className="space-y-2 mb-4">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={filters.search}
                          onChange={(e) =>
                            handleFilterChange('search', e.target.value)
                          }
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    {/* Category */}
                    <div className="space-y-1.5 mb-3">
                      <label className="text-xs font-medium text-gray-700">
                        Categoría
                      </label>
                      <select
                        value={filters.categoryId}
                        onChange={(e) =>
                          handleFilterChange('categoryId', e.target.value)
                        }
                        aria-label="Filtrar por categoría"
                        className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Todas</option>
                        {categories.map((category, index) => (
                          <option
                            key={category._id || `category-${index}`}
                            value={category._id}
                            title={category.name}
                          >
                            {category.name?.length > 20
                              ? `${category.name.substring(0, 20)}...`
                              : category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Faculty */}
                    <div className="space-y-1.5 mb-3">
                      <label className="text-xs font-medium text-gray-700">
                        Facultad
                      </label>
                      <select
                        value={filters.facultyId}
                        onChange={(e) =>
                          handleFilterChange('facultyId', e.target.value)
                        }
                        aria-label="Filtrar por facultad"
                        className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Todas</option>
                        {faculties.map((faculty, index) => (
                          <option
                            key={faculty._id || `faculty-${index}`}
                            value={faculty._id}
                            title={faculty.name}
                          >
                            {faculty.name?.length > 20
                              ? `${faculty.name.substring(0, 20)}...`
                              : faculty.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Career */}
                    <div className="space-y-1.5 mb-3">
                      <label className="text-xs font-medium text-gray-700">
                        Carrera
                      </label>
                      <select
                        value={filters.careerId}
                        onChange={(e) =>
                          handleFilterChange('careerId', e.target.value)
                        }
                        disabled={!filters.facultyId}
                        aria-label="Filtrar por carrera"
                        className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">Todas</option>
                        {careers
                          .filter(
                            (career) =>
                              !filters.facultyId ||
                              career.faculty._id === filters.facultyId
                          )
                          .map((career, index) => (
                            <option
                              key={career._id || `career-${index}`}
                              value={career._id}
                              title={career.name}
                            >
                              {career.name?.length > 20
                                ? `${career.name.substring(0, 20)}...`
                                : career.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    {/* Price Range */}
                    <div className="space-y-1.5 mb-3">
                      <label className="text-xs font-medium text-gray-700">
                        Precio (USD)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice || ''}
                          onChange={(e) =>
                            handleFilterChange(
                              'minPrice',
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice || ''}
                          onChange={(e) =>
                            handleFilterChange(
                              'maxPrice',
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    {/* Sort */}
                    <div className="space-y-1.5 mb-4">
                      <label className="text-xs font-medium text-gray-700">
                        Ordenar por
                      </label>
                      <select
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(e) => {
                          const [sortBy, sortOrder] = e.target.value.split('-');
                          handleFilterChange('sortBy', sortBy);
                          handleFilterChange('sortOrder', sortOrder);
                        }}
                        aria-label="Ordenar servicios"
                        className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="createdAt-desc">Más recientes</option>
                        <option value="createdAt-asc">Más antiguos</option>
                        <option value="price-asc">Precio ↑</option>
                        <option value="price-desc">Precio ↓</option>
                        <option value="rating-desc">Mejor valorados</option>
                      </select>
                    </div>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 bg-transparent hover:bg-gray-50"
                    >
                      Limpiar Filtros
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {loading ? 'Cargando...' : `${total} servicios encontrados`}
                  </h2>
                  {!loading && total > 0 && (
                    <p className="text-gray-500 text-sm mt-1">
                      Mostrando{' '}
                      {Math.min(
                        ((filters.page || 1) - 1) * (filters.limit || 12) + 1,
                        total
                      )}{' '}
                      -{' '}
                      {Math.min(
                        (filters.page || 1) * (filters.limit || 12),
                        total
                      )}{' '}
                      de {total} resultados
                    </p>
                  )}
                </div>
              </div>
            </div>
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
            ) : services && services.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron servicios
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Intenta ajustar tus filtros de búsqueda o explora diferentes
                  categorías
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpiar Filtros
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {services.map((service: Service, index: number) => (
                    <motion.div
                      key={`service-${service._id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 bg-white rounded-xl">
                        {/* Service Image */}
                        <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {service.images && service.images.length > 0 ? (
                            <Image
                              src={service.images[0] || '/placeholder.svg'}
                              alt={service.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                              <Package className="h-12 w-12 text-blue-300" />
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 shadow-sm border-0">
                              {service.category.name?.length > 12
                                ? `${service.category.name.substring(0, 12)}...`
                                : service.category.name}
                            </Badge>
                          </div>

                          {/* Favorite Button */}
                          <button
                            className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
                            title="Agregar a favoritos"
                          >
                            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                          </button>

                          {/* Active Status Indicator */}
                          <div className="absolute bottom-4 left-4">
                            <div className="flex items-center space-x-1.5 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              <span>Disponible</span>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-5 space-y-3">
                          {/* Title */}
                          <div className="min-h-[3rem]">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                              {service.title?.length > 60
                                ? `${service.title.substring(0, 60)}...`
                                : service.title}
                            </h3>
                          </div>

                          {/* Rating and Reviews */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                              <div className="flex items-center space-x-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < Math.floor(service.rating || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {(service.rating || 0).toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({service.totalReviews || 0})
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Desde</div>
                              <div className="font-bold text-gray-900 text-xl">
                                $
                                {service.price > 999
                                  ? `${(service.price / 1000).toFixed(1)}k`
                                  : service.price}
                              </div>
                            </div>
                          </div>

                          {/* Seller Info */}
                          <div className="flex items-center space-x-3 py-3 border-t border-gray-100">
                            <div className="relative flex-shrink-0">
                              <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden ring-2 ring-gray-100 shadow-sm">
                                {service.seller?.profilePhoto ? (
                                  <Image
                                    src={
                                      service.seller.profilePhoto ||
                                      '/placeholder.svg'
                                    }
                                    alt={service.seller.name || 'Usuario'}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <User className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {service.seller?.name?.length > 18
                                  ? `${service.seller.name.substring(0, 18)}...`
                                  : service.seller?.name || 'Usuario'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {service.seller?.career?.name?.length > 20
                                  ? `${service.seller.career.name.substring(
                                      0,
                                      20
                                    )}...`
                                  : service.seller?.career?.name ||
                                    'Freelancer verificado'}
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="pt-2">
                            <Link
                              href={`/services/${service._id || 'undefined'}`}
                            >
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full"
                              >
                                <Button
                                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0 group/btn"
                                  onClick={() =>
                                    console.log(
                                      'Service ID:',
                                      service._id,
                                      'Service:',
                                      service
                                    )
                                  }
                                >
                                  <span className="flex items-center justify-center space-x-2">
                                    <span>Ver Detalles</span>
                                    <motion.div
                                      className="text-white/80 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-300"
                                      whileHover={{ x: 4 }}
                                    >
                                      →
                                    </motion.div>
                                  </span>
                                </Button>
                              </motion.div>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handlePageChange((filters.page || 1) - 1)
                        }
                        disabled={(filters.page || 1) === 1}
                      >
                        Anterior
                      </Button>
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={
                              (filters.page || 1) === page
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => handlePageChange(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        onClick={() =>
                          handlePageChange((filters.page || 1) + 1)
                        }
                        disabled={(filters.page || 1) === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
