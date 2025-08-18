'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useServices } from '@/hooks/useServices';
import { useReviews } from '@/hooks/useReviews';
import { useOrders } from '@/hooks/useOrders';
import { useChats } from '@/hooks/useChats';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthRequiredMessage } from '@/components/auth/auth-required-message';
import {
  Star,
  User,
  MapPin,
  Calendar,
  MessageSquare,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;

  if (!serviceId || serviceId === 'undefined') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ID de servicio inválido
        </h1>
        <Link href="/services">
          <Button>Volver a servicios</Button>
        </Link>
      </div>
    );
  }

  const { user } = useAuth();
  const { getServiceById, getSimilarServices } = useServices();
  const { getServiceReviews, canReviewService, createReview } = useReviews();
  const { createOrder } = useOrders();
  const { createChat } = useChats();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [orderMessage, setOrderMessage] = useState('');

  const serviceQuery = getServiceById(serviceId);
  const service = serviceQuery.data;

  const reviewsQuery = getServiceReviews(serviceId);
  const reviews = reviewsQuery.data?.reviews || [];

  const similarServicesQuery = getSimilarServices(serviceId);
  const similarServices = similarServicesQuery.data || [];

  const canReviewQuery = canReviewService(serviceId);
  const canReview = canReviewQuery.data?.canReview || false;
  const canReviewReason = canReviewQuery.data?.reason;

  const handleCreateOrder = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar una orden');
      return;
    }

    if (isOwner) {
      toast.error('No puedes comprar tu propio servicio');
      return;
    }

    try {
      await createOrder.mutateAsync({
        serviceId,
        message: orderMessage,
      });
      toast.success('Orden creada exitosamente');
      setOrderMessage('');
    } catch (error: unknown) {
      const errorMessage =
        (error as any).response?.data?.message || 'Error al crear la orden';
      toast.error(errorMessage);
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para chatear');
      return;
    }

    if (isOwner) {
      toast.error('No puedes chatear contigo mismo');
      return;
    }

    try {
      const chat = await createChat.mutateAsync({
        serviceId,
        message: 'Hola, estoy interesado en tu servicio.',
      });
      toast.success('Chat iniciado exitosamente');

      // Redirect to the chat
      if (chat?._id) {
        window.location.href = `/dashboard/chats/${chat._id}`;
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as any).response?.data?.message || 'Error al iniciar el chat';
      toast.error(errorMessage);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Debes iniciar sesión para escribir una reseña');
      return;
    }

    if (!canReview) {
      toast.error('No puedes escribir una reseña para este servicio');
      return;
    }

    try {
      const orderId = canReviewQuery.data?.orderId;

      await createReview.mutateAsync({
        service: serviceId,
        order: orderId || '',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success('Reseña enviada exitosamente');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });

      // Refresh the can review status
      canReviewQuery.refetch();
    } catch (error: unknown) {
      const errorMessage =
        (error as any).response?.data?.message || 'Error al enviar reseña';
      toast.error(errorMessage);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={`star-${i}`}
        className={`h-5 w-5 transition-colors ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${
          interactive
            ? 'cursor-pointer hover:text-yellow-400 hover:fill-current'
            : ''
        }`}
        onClick={
          interactive && onRatingChange
            ? () => onRatingChange(i + 1)
            : undefined
        }
      />
    ));
  };

  const nextImage = () => {
    if (service?.images && service.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === service.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (service?.images && service.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? service.images.length - 1 : prev - 1
      );
    }
  };

  if (serviceQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Servicio no encontrado
        </h1>
        <Link href="/services">
          <Button>Volver a servicios</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?._id === service.seller?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/services" className="text-blue-600 hover:text-blue-800">
            ← Volver a servicios
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gray-200">
                {service.images && service.images.length > 0 ? (
                  <>
                    <img
                      src={service.images[currentImageIndex]}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    {service.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {service.images.map((_, index) => (
                            <button
                              key={`image-dot-${index}`}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full ${
                                index === currentImageIndex
                                  ? 'bg-white'
                                  : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen disponible
                  </div>
                )}
              </div>
            </Card>

            {/* Service Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {service.seller?.facultyId?.name || 'No especificada'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(service.createdAt).toLocaleDateString()}
                    </div>
                    <Badge
                      variant={
                        service.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {service.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>

                {/* Service inactive warning */}
                {service.status !== 'active' && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          Este servicio no está activo actualmente y no se
                          pueden realizar pedidos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {renderStars(service.rating || 0)}
                  <span className="ml-2 text-sm text-gray-600">
                    {(service.rating || 0).toFixed(1)} (
                    {service.totalReviews || 0} reseñas)
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  ${service.price}
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

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Categoría:</span>
                  <span className="ml-2 text-gray-600">
                    {service.category?.name || 'No especificada'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Carrera:</span>
                  <span className="ml-2 text-gray-600">
                    {service.seller?.careerId?.name || 'No especificada'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Reseñas ({reviews.length})
                </h3>
                {user &&
                  !isOwner &&
                  (canReview ? (
                    <Button onClick={() => setShowReviewForm(true)}>
                      Escribir reseña
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {canReviewReason ||
                        'Debes comprar este servicio para escribir una reseña'}
                    </div>
                  ))}
              </div>

              {/* Auth required message for reviews */}
              {!user && (
                <div className="mb-6">
                  <AuthRequiredMessage action="escribir reseñas" />
                </div>
              )}

              {/* Can't review message */}
              {user && !isOwner && !canReview && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        {canReviewReason ||
                          'Solo puedes escribir reseñas de servicios que hayas comprado y completado.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <Card className="p-4 mb-6 bg-gray-50">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Escribir una reseña
                  </h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calificación
                      </label>
                      <div className="flex space-x-1">
                        {renderStars(reviewForm.rating, true, (rating) =>
                          setReviewForm((prev) => ({ ...prev, rating }))
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentario
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Comparte tu experiencia..."
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={createReview.isPending}>
                        Enviar Reseña
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsQuery.isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Cargando reseñas...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No hay reseñas aún. ¡Sé el primero en reseñar este servicio!
                  </p>
                ) : (
                  reviews.map((review, index) => (
                    <div
                      key={review._id || `review-${index}`}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
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
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <Link href={`/profile/${service.seller?._id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer transition-colors">
                      {service.seller?.name || 'Usuario'}
                    </h3>
                  </Link>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-1" />
                    Vendedor verificado
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Facultad:</span>
                  <span className="text-gray-900">
                    {service.seller?.facultyId?.name || 'No especificada'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Carrera:</span>
                  <span className="text-gray-900">
                    {service.seller?.careerId?.name || 'No especificada'}
                  </span>
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-3">
                  <Link href={`/profile/${service.seller?._id}`}>
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Ver perfil completo
                    </Button>
                  </Link>
                  {user ? (
                    <Button
                      onClick={handleStartChat}
                      variant="outline"
                      className="w-full"
                      disabled={createChat.isPending}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {createChat.isPending ? 'Conectando...' : 'Contactar'}
                    </Button>
                  ) : (
                    <AuthRequiredMessage action="contactar al vendedor" />
                  )}
                </div>
              )}
            </Card>

            {/* Order Section */}
            {!isOwner && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Realizar Pedido
                </h3>

                {user ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje (opcional)
                      </label>
                      <textarea
                        value={orderMessage}
                        onChange={(e) => setOrderMessage(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe tus requerimientos específicos..."
                      />
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-900">
                          Total:
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${service.price}
                        </span>
                      </div>

                      <Button
                        onClick={handleCreateOrder}
                        className="w-full"
                        disabled={
                          createOrder.isPending || service.status !== 'active'
                        }
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {createOrder.isPending
                          ? 'Procesando...'
                          : service.status !== 'active'
                          ? 'Servicio no disponible'
                          : 'Realizar Pedido'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <AuthRequiredMessage action="realizar un pedido" />
                )}
              </Card>
            )}

            {/* Similar Services */}
            {similarServices.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Servicios Similares
                </h3>
                <div className="space-y-4">
                  {similarServices.slice(0, 3).map((similarService, index) => (
                    <Link
                      key={similarService._id || `similar-${index}`}
                      href={`/services/${similarService._id}`}
                    >
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          {similarService.images &&
                          similarService.images.length > 0 ? (
                            <img
                              src={similarService.images[0]}
                              alt={similarService.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Award className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {similarService.title}
                          </h4>
                          <div className="flex items-center mt-1">
                            {renderStars(similarService.rating || 0)}
                            <span className="text-xs text-gray-500 ml-1">
                              ({similarService.totalReviews || 0})
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-blue-600 mt-1">
                            ${similarService.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
