'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  MapPin,
  Calendar,
  Star,
  Award,
  MessageSquare,
  ExternalLink,
  Shield,
  CheckCircle,
  Eye,
  DollarSign,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { generateInitials } from '@/lib/utils';

interface UserProfile {
  user: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    description?: string;
    facultyId?: {
      _id: string;
      name: string;
      code: string;
    };
    careerId?: {
      _id: string;
      name: string;
      code: string;
    };
    socialNetworks?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  stats: {
    totalServices: number;
    totalSales: number;
    totalEarnings: number;
    totalPurchases: number;
    totalViews: number;
    averageRating: number;
    totalReviews: number;
  };
  recentServices: Service[];
  recentReviews: Review[];
}

interface Service {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  viewCount: number;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  reviewer: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  service: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [activeTab, setActiveTab] = useState<'services' | 'reviews'>(
    'services'
  );

  // Fetch user profile with all data
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile-complete', userId],
    queryFn: async (): Promise<UserProfile> => {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    },
    enabled: !!userId,
  });

  // Fetch all user services for the services tab
  const { data: allUserServices, isLoading: servicesLoading } = useQuery({
    queryKey: ['user-services-all', userId],
    queryFn: async (): Promise<{ services: Service[] }> => {
      const response = await api.get(`/users/${userId}/services`);
      return response.data;
    },
    enabled: !!userId,
  });

  // Fetch all user reviews for the reviews tab
  const { data: allUserReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['user-reviews-all', userId],
    queryFn: async (): Promise<{ reviews: Review[] }> => {
      const response = await api.get(`/users/${userId}/reviews`);
      return response.data;
    },
    enabled: !!userId,
  });

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

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return (
          <div className="w-5 h-5 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        );
      case 'linkedin':
        return (
          <div className="w-5 h-5 bg-blue-700 rounded-lg flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
        );
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Usuario no encontrado
        </h1>
        <Link href="/services">
          <Button>Volver a servicios</Button>
        </Link>
      </div>
    );
  }

  const { user, stats, recentServices, recentReviews } = userProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del perfil */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              {user.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={user.name}
                  width={120}
                  height={120}
                  className="h-30 w-30 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-30 w-30 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {generateInitials(user.name)}
                </div>
              )}
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
                {user.isVerified && (
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                )}
                <Badge variant="outline">Estudiante</Badge>
              </div>

              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                {user.facultyId && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {user.facultyId.name}
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Miembro desde {new Date(user.createdAt).getFullYear()}
                </div>
              </div>

              {user.careerId && (
                <p className="text-gray-600 mb-4">
                  <strong>Carrera:</strong> {user.careerId.name}
                </p>
              )}

              {user.description && (
                <p className="text-gray-700 mb-6">{user.description}</p>
              )}

              {/* Redes sociales */}
              {user.socialNetworks &&
                Object.values(user.socialNetworks).some((url) => url) && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Redes Sociales
                    </h3>
                    <div className="flex space-x-3">
                      {Object.entries(user.socialNetworks).map(
                        ([platform, url]) => {
                          if (!url) return null;
                          return (
                            <a
                              key={platform}
                              href={
                                url.startsWith('http') ? url : `https://${url}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 hover:shadow-sm group"
                            >
                              <div className="group-hover:scale-110 transition-transform duration-200">
                                {getSocialIcon(platform)}
                              </div>
                              <span className="text-sm font-medium capitalize text-gray-700 group-hover:text-gray-900">
                                {platform}
                              </span>
                            </a>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {/* Estadísticas mejoradas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-blue-600 mr-1" />
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.totalServices}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 font-medium">
                    Servicios
                  </div>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <ShoppingBag className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">
                      {stats.totalSales}
                    </span>
                  </div>
                  <div className="text-sm text-green-700 font-medium">
                    Ventas
                  </div>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-600 mr-1" />
                    <span className="text-2xl font-bold text-yellow-600">
                      {stats.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-sm text-yellow-700 font-medium">
                    Calificación
                  </div>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="h-5 w-5 text-purple-600 mr-1" />
                    <span className="text-2xl font-bold text-purple-600">
                      {stats.totalViews}
                    </span>
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    Visualizaciones
                  </div>
                </Card>
              </div>

              {/* Estadísticas adicionales */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <Card className="p-3 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="h-4 w-4 text-orange-600 mr-1" />
                    <span className="text-lg font-bold text-orange-600">
                      ${stats.totalEarnings}
                    </span>
                  </div>
                  <div className="text-xs text-orange-700 font-medium">
                    Ganancias
                  </div>
                </Card>

                <Card className="p-3 text-center bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                  <div className="flex items-center justify-center mb-1">
                    <MessageSquare className="h-4 w-4 text-indigo-600 mr-1" />
                    <span className="text-lg font-bold text-indigo-600">
                      {stats.totalReviews}
                    </span>
                  </div>
                  <div className="text-xs text-indigo-700 font-medium">
                    Reseñas
                  </div>
                </Card>

                <Card className="p-3 text-center bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="h-4 w-4 text-teal-600 mr-1" />
                    <span className="text-lg font-bold text-teal-600">
                      {stats.totalPurchases}
                    </span>
                  </div>
                  <div className="text-xs text-teal-700 font-medium">
                    Compras
                  </div>
                </Card>
              </div>
            </div>

            {/* Botón de contacto */}
            <div>
              <Button className="w-full md:w-auto">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contactar
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('services')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Servicios ({allUserServices?.services?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reseñas ({allUserReviews?.reviews?.length || 0})
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </Card>
              ))
            ) : allUserServices?.services &&
              allUserServices.services.length > 0 ? (
              allUserServices.services.map((service) => (
                <Link key={service._id} href={`/services/${service._id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                      {service.images && service.images.length > 0 ? (
                        <Image
                          src={service.images[0]}
                          alt={service.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Award className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {service.title}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Eye className="h-4 w-4" />
                          <span>{service.viewCount} vistas</span>
                        </div>
                        <span className="text-lg font-bold text-primary-600">
                          ${service.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {service.category.name}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(service.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay servicios disponibles</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviewsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : allUserReviews?.reviews && allUserReviews.reviews.length > 0 ? (
              allUserReviews.reviews.map((review) => (
                <Card
                  key={review._id}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {review.reviewer.profilePhoto ? (
                        <Image
                          src={review.reviewer.profilePhoto}
                          alt={review.reviewer.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {review.reviewer.name}
                        </span>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.service && (
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs">
                            {review.service.title}
                          </Badge>
                        </div>
                      )}
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay reseñas disponibles</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
