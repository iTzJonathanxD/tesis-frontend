'use client';

import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Review } from '@/types';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const { myReviews, updateReview, deleteReview, isLoading } = useReviews();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: '',
  });

  const filteredReviews = myReviews.filter((review) =>
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;

    try {
      await updateReview.mutateAsync({
        id: editingReview.id,
        data: editForm,
      });
      toast.success('Reseña actualizada exitosamente');
      setEditingReview(null);
    } catch (error) {
      toast.error('Error al actualizar reseña');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await deleteReview.mutateAsync(reviewId);
        toast.success('Reseña eliminada exitosamente');
      } catch (error) {
        toast.error('Error al eliminar reseña');
      }
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={
          interactive && onRatingChange
            ? () => onRatingChange(i + 1)
            : undefined
        }
      />
    ));
  };

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Mis Reseñas</h1>
          <p className="text-gray-600">Gestiona las reseñas que has escrito</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Reseñas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {myReviews.length}
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
                {myReviews.length > 0
                  ? (
                      myReviews.reduce((sum, r) => sum + r.rating, 0) /
                      myReviews.length
                    ).toFixed(1)
                  : '0.0'}
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
                {myReviews.filter((r) => r.rating === 5).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar en tus reseñas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Edit Modal */}
      {editingReview && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Editar Reseña
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación
              </label>
              <div className="flex space-x-1">
                {renderStars(editForm.rating, true, (rating) =>
                  setEditForm((prev) => ({ ...prev, rating }))
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario
              </label>
              <textarea
                value={editForm.comment}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, comment: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe tu reseña..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveEdit}
                disabled={updateReview.isPending}
              >
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={() => setEditingReview(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="p-12 text-center">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes reseñas
            </h3>
            <p className="text-gray-600">
              Las reseñas que escribas aparecerán aquí
            </p>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500 ml-2">
                        {review.rating}/5
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-gray-900 mb-4">{review.comment}</p>

                  <div className="text-sm text-gray-500">
                    Reseña #{review.id.slice(-8)}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(review)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(review.id)}
                    disabled={deleteReview.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
