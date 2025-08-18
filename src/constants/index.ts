// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: 'ULEAM Conecta',
  DESCRIPTION:
    'Plataforma que conecta estudiantes de ULEAM para intercambiar servicios académicos',
  URL: 'https://uleam-conecta.com',
  SUPPORT_EMAIL: 'soporte@uleam-conecta.com',
  VERSION: '1.0.0',
} as const;

// User Roles
export const USER_ROLES = {
  STUDENT: 'estudiante',
  ADMIN: 'admin',
} as const;

// Service Status
export const SERVICE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  TRANSFER: 'transfer',
  CASH: 'cash',
} as const;

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
} as const;

// Verification Types
export const VERIFICATION_TYPES = {
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
} as const;

// Rating
export const RATING = {
  MIN: 1,
  MAX: 5,
} as const;

// Price
export const PRICE = {
  MIN: 1,
  MAX: 1000,
  CURRENCY: 'USD',
} as const;

// ULEAM Domains
export const ULEAM_DOMAINS = ['uleam.edu.ec', 'live.uleam.edu.ec'] as const;

// Social Networks
export const SOCIAL_NETWORKS = {
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error inesperado',
  NETWORK: 'Error de conexión. Verifica tu internet',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION: 'Los datos ingresados no son válidos',
  SERVER: 'Error del servidor. Intenta más tarde',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: '¡Bienvenido a ULEAM Conecta!',
  REGISTER: 'Cuenta creada exitosamente',
  LOGOUT: 'Sesión cerrada exitosamente',
  UPDATE_PROFILE: 'Perfil actualizado exitosamente',
  SERVICE_CREATED: 'Servicio creado exitosamente',
  ORDER_CREATED: 'Orden creada exitosamente',
  PAYMENT_CONFIRMED: 'Pago confirmado exitosamente',
  MESSAGE_SENT: 'Mensaje enviado',
  REVIEW_SUBMITTED: 'Reseña enviada exitosamente',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SERVICES: '/services',
  SERVICE_DETAIL: '/services/[id]',
  CREATE_SERVICE: '/services/create',
  EDIT_SERVICE: '/services/[id]/edit',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/[id]',
  CHATS: '/chats',
  CHAT_DETAIL: '/chats/[id]',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  FAQ: '/faq',
  HELP: '/help',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  SERVICES: 'services',
  SERVICE: 'service',
  MY_SERVICES: 'my-services',
  ORDERS: 'orders',
  ORDER: 'order',
  PAYMENTS: 'payments',
  PAYMENT: 'payment',
  REVIEWS: 'reviews',
  CHATS: 'chats',
  CHAT: 'chat',
  MESSAGES: 'messages',
  USER_PROFILE: 'user-profile',
  USER_METRICS: 'user-metrics',
  FACULTIES: 'faculties',
  CAREERS: 'careers',
  CATEGORIES: 'categories',
  SEARCH_SERVICES: 'search-services',
  NOTIFICATIONS: 'notifications',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SYMBOL: true,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  SERVICE_TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
  },
  SERVICE_DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1000,
  },
  REVIEW_COMMENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: "dd 'de' MMMM 'de' yyyy",
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
} as const;

// Theme Configuration
export const THEME = {
  DEFAULT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;
