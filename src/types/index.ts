// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  facultyId?: Faculty;
  careerId?: Career;
  description?: string;
  socialNetworks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  totalSales: number;
  totalEarnings: number;
  totalPurchases: number;
  role: 'student' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  facultyId: string;
  careerId: string;
  description?: string;
  socialNetworks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Academic Types
export interface Faculty {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Career {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  faculty: {
    _id: string;
    name: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

// Service Types
export interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  seller: {
    _id: string;
    name: string;
    profilePhoto?: string;
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
  };
  category: Category;
  faculty: Faculty;
  career: Career;
  rating?: number;
  totalReviews?: number;
  status?: 'active' | 'inactive' | 'suspended';
  isActive: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  facultyId: string;
  careerId: string;
  images?: File[];
}

// Order Types
export interface Order {
  _id: string;
  service: Service;
  buyer: User;
  seller: User;
  status: 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  serviceId: string;
  message?: string;
}

// Payment Types
export interface Payment {
  _id: string;
  order: Order;
  amount: number;
  paymentMethod: 'transfer' | 'cash';
  transactionReference?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  paymentMethod: 'transfer' | 'cash';
  transactionReference?: string;
}

// Review Types
export interface Review {
  _id: string;
  service: string;
  order: string;
  reviewer: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  service: string;
  order: string;
  rating: number;
  comment: string;
}

// Chat Types
export interface Chat {
  _id: string;
  buyer: User;
  seller: User;
  service: {
    title: string;
    images: string[];
  };
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isActive: boolean;
}

export interface Message {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    name: string;
  };
  content: string;
  messageType: 'text' | 'image';
  isRead: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Upload Types
export interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

// Verification Types
export interface VerificationRequest {
  email: string;
  type?: 'email_verification' | 'password_reset';
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
  type?: 'email_verification' | 'password_reset';
}

// Search and Filter Types
export interface ServiceFilters {
  page?: number;
  limit?: number;
  facultyId?: string;
  careerId?: string;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// Metrics Types
export interface UserMetrics {
  totalSales: number;
  totalEarnings: number;
  totalPurchases: number;
  activeServices: number;
  averageRating: number;
  thisMonthSales: number;
  thisMonthEarnings: number;
}

export interface SellerDashboard {
  totalSales: number;
  totalEarnings: number;
  activeServices: number;
  averageRating: number;
  thisMonthSales: number;
  thisMonthEarnings: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface SellerMetrics {
  statistics: {
    totalSales: number;
    totalEarnings: number;
    activeServices: number;
    averageRating: number;
    completedOrders: number;
    pendingOrders: number;
  };
  topServices: Array<{
    id: string;
    title: string;
    totalSales: number;
    totalEarnings: number;
    rating: number;
  }>;
  monthlyEarnings: Array<{
    month: string;
    earnings: number;
    sales: number;
  }>;
}

export interface PaymentStatistics {
  totalPayments: number;
  totalAmount: number;
  pendingPayments: number;
  confirmedPayments: number;
  rejectedPayments: number;
  monthlyStats: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalServices: number;
  totalOrders: number;
  totalPayments: number;
  monthlyRevenue: number;
  activeUsers: number;
  pendingVerifications: number;
}

export interface AdminUser extends User {
  lastLogin?: string;
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdServices: number;
  totalOrders: number;
}

// Upload Transform Types
export interface ImageTransform {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  quality?: number;
  format?: 'jpg' | 'png' | 'webp';
}

export interface ImageVariant {
  name: string;
  url: string;
  width: number;
  height: number;
  format: string;
}

// Advanced Search Types
export interface AdvancedSearchFilters extends ServiceFilters {
  tags?: string[];
  rating?: number;
  hasReviews?: boolean;
  isVerifiedSeller?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  type: 'order' | 'payment' | 'review' | 'chat' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}
