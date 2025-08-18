'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useServices } from '@/hooks/useServices';
import { useCategories } from '@/hooks/useCategories';
import { useAcademic } from '@/hooks/useAcademic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Star,
  MapPin,
  User,
  DollarSign,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { AdvancedSearchFilters, Service } from '@/types';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { advancedSearch } = useServices();
  const { categories } = useCategories();
  const { faculties, careers } = useAcademic();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    search: searchParams.get('q') || '',
    page: 1,
    limit: 12,
    categoryId: '',
    facultyId: '',
    careerId: '',
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
    hasReviews: false,
    isVerifiedSeller: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const searchQuery = advancedSearch(filters);
  const services = searchQuery.data?.data.items || [];
  const total = searchQuery.data?.data.total || 0;
  const totalPages = searchQuery.data?.data.totalPages || 0;

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setFilters((prev) => ({ ...prev, search: query }));
    }
  }, [searchParams]);

  const handleFilterChange = (key: keyof AdvancedSearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: filters.search,
      page: 1,
      limit: 12,
      categoryId: '',
      facultyId: '',
      careerId: '',
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      hasReviews: false,
      isVerifiedSeller: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const filteredCareers = careers.filter(
    (career) => !filters.facultyId || career.faculty._id === filters.facultyId
  );

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (
      key === 'search' ||
      key === 'page' ||
      key === 'limit' ||
      key === 'sortBy' ||
      key === 'sortOrder'
    ) {
      return false;
    }
    return value !== undefined && value !== '' && value !== false;
  }).length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Buscar Servicios
          </h1>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="¿Qué servicio necesitas?"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-80 flex-shrink-0`}
          >
            <Card className="p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) =>
                      handleFilterChange('categoryId', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Faculty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facultad
                  </label>
                  <select
                    value={filters.facultyId}
                    onChange={(e) => {
                      handleFilterChange('facultyId', e.target.value);
                      handleFilterChange('careerId', ''); // Reset career
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas las facultades</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Career Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carrera
                  </label>
                  <select
                    value={filters.careerId}
                    onChange={(e) =>
                      handleFilterChange('careerId', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!filters.facultyId}
                  >
                    <option value="">Todas las carreras</option>
                    {filteredCareers.map((career) => (
                      <option key={career.id} value={career.id}>
                        {career.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de Precio
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mín"
                      value={filters.minPrice || ''}
                      onChange={(e) =>
                        handleFilterChange(
                          'minPrice',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Máx"
                      value={filters.maxPrice || ''}
                      onChange={(e) =>
                        handleFilterChange(
                          'maxPrice',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calificación Mínima
                  </label>
                  <select
                    value={filters.rating || ''}
                    onChange={(e) =>
                      handleFilterChange(
                        'rating',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Cualquier calificación</option>
                    <option value="4">4+ estrellas</option>
                    <option value="3">3+ estrellas</option>
                    <option value="2">2+ estrellas</option>
                    <option value="1">1+ estrellas</option>
                  </select>
                </div>

                {/* Additional Filters */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasReviews}
                      onChange={(e) =>
                        handleFilterChange('hasReviews', e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Solo con reseñas
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isVerifiedSeller}
                      onChange={(e) =>
                        handleFilterChange('isVerifiedSeller', e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Vendedores verificados
                    </span>
                  </label>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt-desc">Más recientes</option>
                    <option value="createdAt-asc">Más antiguos</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="rating-desc">Mejor calificados</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {total} servicios encontrados
                </h2>
                {filters.search && (
                  <p className="text-gray-600">
                    Resultados para "{filters.search}"
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {searchQuery.isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* No Results */}
            {!searchQuery.isLoading && services.length === 0 && (
              <Card className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron servicios
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </Card>
            )}

            {/* Services Grid */}
            {!searchQuery.isLoading && services.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {services.map((service: Service) => (
                    <Link key={service.id} href={`/services/${service.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
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
                          <div className="absolute top-2 right-2">
                            <Badge
                              variant={
                                service.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {service.status === 'active'
                                ? 'Activo'
                                : 'Inactivo'}
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
                              {renderStars(service.rating)}
                              <span className="text-sm text-gray-500 ml-1">
                                ({service.totalReviews})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {service.seller.name}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {service.faculty?.name}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      disabled={filters.page === 1}
                      onClick={() =>
                        handleFilterChange('page', filters.page - 1)
                      }
                    >
                      Anterior
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={
                            filters.page === page ? 'default' : 'outline'
                          }
                          onClick={() => handleFilterChange('page', page)}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      disabled={filters.page === totalPages}
                      onClick={() =>
                        handleFilterChange('page', filters.page + 1)
                      }
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
