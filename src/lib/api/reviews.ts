import { api } from './base';

// Types based on your backend schema
export interface Review {
  _id: string;
  reviewer: {
    _id: string;
    name: string;
    avatar?: string;
  };
  reviewee: {
    _id: string;
    name: string;
    avatar?: string;
  };
  service: {
    _id: string;
    title: string;
  };
  order: {
    _id: string;
  };
  rating: number;
  comment: string;
  isEdited: boolean;
  editedAt?: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  service: string; // ObjectId as string
  order: string; // ObjectId as string - required field
  rating: number; // 1-5
  comment: string; // 10-1000 characters, no HTML
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface ReviewFilters {
  service?: string;
  reviewer?: string;
  reviewee?: string;
  rating?: number; // 1-5
  isVisible?: boolean;
  page?: number;
  limit?: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// API Functions
export class ReviewsAPI {
  /**
   * Get all reviews with pagination and filters
   */
  static async getReviews(filters?: ReviewFilters): Promise<ReviewsResponse> {
    const response = await api.get('/reviews', { params: filters });
    return response.data;
  }

  /**
   * Get reviews for a specific service
   */
  static async getServiceReviews(
    serviceId: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
      isVisible?: boolean;
    }
  ): Promise<ReviewsResponse> {
    const response = await api.get(`/reviews/service/${serviceId}`, { params });
    return response.data;
  }

  /**
   * Get current user's reviews (as reviewer)
   */
  static async getMyReviews(params?: {
    page?: number;
    limit?: number;
  }): Promise<ReviewsResponse> {
    const response = await api.get('/reviews/my-reviews', { params });
    return response.data;
  }

  /**
   * Get reviews received by current user (as reviewee)
   */
  static async getReceivedReviews(params?: {
    page?: number;
    limit?: number;
  }): Promise<ReviewsResponse> {
    const response = await api.get('/reviews/received', { params });
    return response.data;
  }

  /**
   * Get a single review by ID
   */
  static async getReview(reviewId: string): Promise<Review> {
    const response = await api.get(`/reviews/${reviewId}`);
    return response.data;
  }

  /**
   * Create a new review
   */
  static async createReview(data: CreateReviewData): Promise<Review> {
    const response = await api.post('/reviews', data);
    return response.data;
  }

  /**
   * Update an existing review
   */
  static async updateReview(
    reviewId: string,
    data: UpdateReviewData
  ): Promise<Review> {
    const response = await api.patch(`/reviews/${reviewId}`, data);
    return response.data;
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  }

  /**
   * Get review statistics for a service
   */
  static async getServiceReviewStats(serviceId: string): Promise<ReviewStats> {
    const response = await api.get(`/reviews/service/${serviceId}/stats`);
    return response.data;
  }

  /**
   * Check if user can review a service/order
   */
  static async canReviewOrder(orderId: string): Promise<boolean> {
    const response = await api.get(`/reviews/can-review/order/${orderId}`);
    return response.data.canReview;
  }

  /**
   * Get user's review for a specific order
   */
  static async getOrderReview(orderId: string): Promise<Review | null> {
    try {
      const response = await api.get(`/reviews/order/${orderId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

// Utility functions
export class ReviewsUtils {
  /**
   * Calculate average rating from reviews array
   */
  static calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  /**
   * Get rating distribution from reviews array
   */
  static getRatingDistribution(
    reviews: Review[]
  ): ReviewStats['ratingDistribution'] {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  }

  /**
   * Format review date for display
   */
  static formatReviewDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Hoy';
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} días`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `Hace ${years} año${years > 1 ? 's' : ''}`;
    }
  }

  /**
   * Validate review data before submission (matches your backend validation)
   */
  static validateReviewData(data: CreateReviewData): string[] {
    const errors: string[] = [];

    if (
      !data.rating ||
      data.rating < 1 ||
      data.rating > 5 ||
      !Number.isInteger(data.rating)
    ) {
      errors.push('La calificación debe ser un número entero entre 1 y 5');
    }

    if (!data.comment || data.comment.trim().length < 10) {
      errors.push('El comentario debe tener al menos 10 caracteres');
    }

    if (data.comment && data.comment.length > 1000) {
      errors.push('El comentario no puede exceder 1000 caracteres');
    }

    if (data.comment && /<[^>]*>/.test(data.comment)) {
      errors.push('El comentario no puede contener etiquetas HTML');
    }

    if (!data.service) {
      errors.push('El ID del servicio es requerido');
    }

    if (!data.order) {
      errors.push('El ID de la orden es requerido');
    }

    return errors;
  }

  /**
   * Get star rating display array
   */
  static getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, index) => index < rating);
  }

  /**
   * Get rating color class for UI
   */
  static getRatingColorClass(rating: number): string {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 3.5) return 'text-yellow-500';
    if (rating >= 2.5) return 'text-orange-500';
    return 'text-red-500';
  }

  /**
   * Get rating text description
   */
  static getRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 3.5) return 'Muy bueno';
    if (rating >= 2.5) return 'Bueno';
    if (rating >= 1.5) return 'Regular';
    return 'Malo';
  }

  /**
   * Check if review was edited
   */
  static wasEdited(review: Review): boolean {
    return review.isEdited && !!review.editedAt;
  }

  /**
   * Get edit status text
   */
  static getEditStatusText(review: Review): string {
    if (!review.isEdited || !review.editedAt) return '';
    return `Editado el ${this.formatReviewDate(review.editedAt)}`;
  }
}

// Export default instance for convenience
export const reviewsAPI = ReviewsAPI;
export const reviewsUtils = ReviewsUtils;

// Export all functions for individual imports
export const {
  getReviews,
  getServiceReviews,
  getMyReviews,
  getReceivedReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getServiceReviewStats,
  canReviewOrder,
  getOrderReview,
} = ReviewsAPI;
