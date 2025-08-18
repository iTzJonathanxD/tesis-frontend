import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  Service,
  CreateServiceRequest,
  ServiceFilters,
  PaginatedResponse,
  AdvancedSearchFilters,
} from '@/types';

// Helper function to safely access localStorage
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const usePaginatedServices = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: async ({ queryKey }): Promise<PaginatedResponse<Service>> => {
      const [_key, currentFilters] = queryKey as [
        string,
        ServiceFilters | undefined
      ];

      const params = new URLSearchParams();
      if (currentFilters) {
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/services?${params.toString()}`);
      const backendData = response.data;

      // Debug: Log the services to check if they have IDs
      console.log('Backend services data:', backendData.services);

      return {
        success: true,
        data: {
          items: backendData.services || [],
          total: backendData.pagination?.totalItems || 0,
          page: backendData.pagination?.currentPage || 1,
          totalPages: backendData.pagination?.totalPages || 0,
        },
      };
    },
    enabled: true, // This query should always be enabled as it's the main list
    // Add staleTime/cacheTime if needed for performance
  });
};
export const useMyServices = () => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const getMyServices = useQuery({
    queryKey: ['my-services'],
    queryFn: async (): Promise<Service[]> => {
      const response = await api.get('/services/my-services');
      // El backend devuelve { services: [...], pagination: {...} }
      return response.data?.services || [];
    },
    enabled: !!accessToken,
  });

  return {
    myServices: getMyServices.data || [],
    isLoading: getMyServices.isLoading,
    error: getMyServices.error,
    refetch: getMyServices.refetch,
  };
};

export const useServices = () => {
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const createService = useMutation({
    mutationFn: async (data: CreateServiceRequest): Promise<Service> => {
      const formData = new FormData();

      // Add text fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('categoryId', data.categoryId);
      formData.append('facultyId', data.facultyId);
      formData.append('careerId', data.careerId);

      // Add images if they exist
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await api.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] }); // Invalidate the main list
      queryClient.invalidateQueries({ queryKey: ['my-services'] }); // Invalidate user's services
    },
  });

  const getMyServices = useQuery({
    queryKey: ['my-services'],
    queryFn: async (): Promise<Service[]> => {
      const response = await api.get('/services/my-services');
      // El backend devuelve { services: [...], pagination: {...} }
      return response.data?.services || [];
    },
    enabled: !!accessToken,
  });

  const getFeaturedServices = useQuery({
    queryKey: ['featured-services'],
    queryFn: async (): Promise<Service[]> => {
      const response = await api.get('/services/featured');
      return response.data || [];
    },
  });

  const getPopularServices = useQuery({
    queryKey: ['popular-services'],
    queryFn: async (): Promise<Service[]> => {
      const response = await api.get('/services/popular');
      return response.data || [];
    },
  });

  const getRecentServices = useQuery({
    queryKey: ['recent-services'],
    queryFn: async (): Promise<Service[]> => {
      const response = await api.get('/services/recent');
      return response.data || [];
    },
  });

  const getServiceById = (id: string) => {
    return useQuery({
      queryKey: ['service', id],
      queryFn: async ({ queryKey }): Promise<Service> => {
        const [_key, currentId] = queryKey as [string, string];
        const response = await api.get(`/services/${currentId}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const getServicesByCategory = (categoryId: string) => {
    return useQuery({
      queryKey: ['services-by-category', categoryId],
      queryFn: async ({ queryKey }): Promise<PaginatedResponse<Service>> => {
        const [_key, currentCategoryId] = queryKey as [string, string];
        const response = await api.get(
          `/services/category/${currentCategoryId}`
        );
        const backendData = response.data;
        if (Array.isArray(backendData)) {
          return {
            success: true,
            data: {
              items: backendData,
              total: backendData.length,
              page: 1,
              totalPages: 1,
            },
          };
        }
        return {
          success: true,
          data: {
            items: backendData.services || backendData || [],
            total:
              backendData.pagination?.totalItems || backendData.length || 0,
            page: backendData.pagination?.currentPage || 1,
            totalPages: backendData.pagination?.totalPages || 1,
          },
        };
      },
      enabled: !!categoryId,
    });
  };

  const getServicesByFaculty = (facultyId: string) => {
    return useQuery({
      queryKey: ['services-by-faculty', facultyId],
      queryFn: async ({ queryKey }): Promise<PaginatedResponse<Service>> => {
        const [_key, currentFacultyId] = queryKey as [string, string];
        const response = await api.get(`/services/faculty/${currentFacultyId}`);
        const backendData = response.data;
        if (Array.isArray(backendData)) {
          return {
            success: true,
            data: {
              items: backendData,
              total: backendData.length,
              page: 1,
              totalPages: 1,
            },
          };
        }
        return {
          success: true,
          data: {
            items: backendData.services || backendData || [],
            total:
              backendData.pagination?.totalItems || backendData.length || 0,
            page: backendData.pagination?.currentPage || 1,
            totalPages: backendData.pagination?.totalPages || 1,
          },
        };
      },
      enabled: !!facultyId,
    });
  };

  const getServicesByCareer = (careerId: string) => {
    return useQuery({
      queryKey: ['services-by-career', careerId],
      queryFn: async ({ queryKey }): Promise<PaginatedResponse<Service>> => {
        const [_key, currentCareerId] = queryKey as [string, string];
        const response = await api.get(`/services/career/${currentCareerId}`);
        const backendData = response.data;
        if (Array.isArray(backendData)) {
          return {
            success: true,
            data: {
              items: backendData,
              total: backendData.length,
              page: 1,
              totalPages: 1,
            },
          };
        }
        return {
          success: true,
          data: {
            items: backendData.services || backendData || [],
            total:
              backendData.pagination?.totalItems || backendData.length || 0,
            page: backendData.pagination?.currentPage || 1,
            totalPages: backendData.pagination?.totalPages || 1,
          },
        };
      },
      enabled: !!careerId,
    });
  };

  const getSimilarServices = (serviceId: string) => {
    return useQuery({
      queryKey: ['similar-services', serviceId],
      queryFn: async ({ queryKey }): Promise<Service[]> => {
        const [_key, currentServiceId] = queryKey as [string, string];
        const response = await api.get(`/services/${currentServiceId}/similar`);
        return response.data || [];
      },
      enabled: !!serviceId,
    });
  };

  const advancedSearch = (filters: AdvancedSearchFilters) => {
    const [_key, currentFilters] = ['advanced-search', filters] as [
      string,
      AdvancedSearchFilters
    ];

    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return {
      queryKey: ['advanced-search', filters],
      queryFn: async (): Promise<PaginatedResponse<Service>> => {
        const response = await api.get(
          `/services/search/advanced?${params.toString()}`
        );
        const backendData = response.data;
        return {
          success: true,
          data: {
            items: backendData.services || [],
            total: backendData.pagination?.totalItems || 0,
            page: backendData.pagination?.currentPage || 1,
            totalPages: backendData.pagination?.totalPages || 0,
          },
        };
      },
      enabled: Object.keys(filters).length > 0,
    };
  };

  const updateService = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: any; // Changed to any to handle FormData
    }) => {
      let requestData;

      if (data.images && data.images.length > 0) {
        // If there are new images, use FormData
        const formData = new FormData();

        // Add text fields
        if (data.title) formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.price) formData.append('price', data.price.toString());
        if (data.categoryId) formData.append('categoryId', data.categoryId);
        if (data.facultyId) formData.append('facultyId', data.facultyId);
        if (data.careerId) formData.append('careerId', data.careerId);

        // Add existing images if any
        if (data.existingImages) {
          data.existingImages.forEach((imageUrl: string) => {
            formData.append('existingImages', imageUrl);
          });
        }

        // Add new images
        data.images.forEach((image: File) => {
          formData.append('images', image);
        });

        requestData = formData;
      } else {
        // No new images, send JSON
        requestData = {
          title: data.title,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
          facultyId: data.facultyId,
          careerId: data.careerId,
          existingImages: data.existingImages,
        };
      }

      const response = await api.patch(`/services/${id}`, requestData, {
        headers:
          data.images && data.images.length > 0
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
    },
  });

  const toggleServiceActive = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/services/${id}/toggle-active`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
    },
  });

  const toggleServiceFeatured = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/services/${id}/toggle-featured`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['featured-services'] });
    },
  });

  return {
    createService,
    getMyServices,
    getServices: getMyServices,
    getServiceById,
    getFeaturedServices,
    getPopularServices,
    getRecentServices,
    getServicesByCategory,
    getServicesByFaculty,
    getServicesByCareer,
    getSimilarServices,
    advancedSearch,
    updateService,
    deleteService,
    toggleServiceActive,
    toggleServiceFeatured,
    myServices: getMyServices.data || [],
    featuredServices: getFeaturedServices.data || [],
    popularServices: getPopularServices.data || [],
    recentServices: getRecentServices.data || [],
    isLoading: getMyServices.isLoading,
  };
};
