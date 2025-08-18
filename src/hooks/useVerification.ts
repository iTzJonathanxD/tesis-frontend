import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { VerificationRequest, VerifyCodeRequest, ApiResponse } from '@/types';
import { toast } from 'sonner';

export const useSendVerificationCode = () => {
  return useMutation({
    mutationFn: async (data: VerificationRequest) => {
      const response = await api.post<ApiResponse<{ expiresAt: string }>>(
        '/verification/send-code',
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Código de verificación enviado a tu correo');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al enviar el código de verificación');
    },
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: async (data: VerifyCodeRequest) => {
      const response = await api.post<
        ApiResponse<{ isVerified: boolean; user: any }>
      >('/verification/verify-code', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Código verificado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Código de verificación inválido');
    },
  });
};

export const useResendCode = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/verification/resend-code', { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Código reenviado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al reenviar el código');
    },
  });
};
