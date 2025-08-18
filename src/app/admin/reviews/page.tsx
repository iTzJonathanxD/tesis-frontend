'use client';

import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Trash2, Eye, User } from 'lucide-react';
import { Review } from '@/types';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const { reviews, deleteReview, isLoading } = useReviews();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<
    'all' | '1' | '2' | '3' | '4' | '5'
  >('all');

  const filteredReviews = reviews.filter((review: Review) => {
    const matchesSearch =
      review.reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      filterRating === 'all' || review.rating.toString() === filterRating;

    return matchesSearch && matchesRating;
  });

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await deleteReview.mutateAsync(reviewId);
        toast.success('Reseña eliminada exitosamente');
      } catch (error) {
        toast.error('Error al eliminar reseña');
      }
    }
  };

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

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Reseñas
          </h1>
          <p className="text-gray-600">Administra las reseñas del sistema</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Reseñas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reviews.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600 fill-current" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">
                {getAverageRating()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-green-600 fill-current" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">5 Estrellas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ratingDistribution[5]}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-red-600 fill-current" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">1 Estrella</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ratingDistribution[1]}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar reseñas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterRating === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterRating('all')}
              size="sm"
            >
              Todas
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={
                  filterRating === rating.toString() ? 'default' : 'outline'
                }
                onClick={() => setFilterRating(rating.toString() as any)}
                size="sm"
                className="flex items-center"
              >
                {rating} <Star className="h-3 w-3 ml-1 fill-current" />
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review: Review) => (
          <Card key={review._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {review.reviewer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {review.reviewer.name}
                      </p>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500 ml-2">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-900 mb-2">{review.comment}</p>
                  <div className="text-sm text-gray-500">
                    Reseña #{review._id.slice(-8)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Servicio
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteReview(review._id)}
                  disabled={deleteReview.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron reseñas</p>
        </div>
      )}
    </div>
  );
}
