'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import {
  validateName,
  validateDescription,
  validateSocialNetworks,
  hasFormErrors,
} from '@/lib/validation';

interface ProfileFormData {
  name: string;
  description: string;
  socialNetworks: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
}

export default function ProfileForm() {
  const { user } = useAuth(); // Obtener usuario del contexto
  const { profile, updateProfile, isLoading } = useProfile();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    description: '',
    socialNetworks: {
      instagram: '',
      facebook: '',
      linkedin: '',
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Usar datos del usuario del contexto primero, luego del profile
    const userData = user || profile;
    if (userData) {
      setFormData({
        name: userData.name || '',
        description: userData.description || '',
        socialNetworks: {
          instagram: userData.socialNetworks?.instagram || '',
          facebook: userData.socialNetworks?.facebook || '',
          linkedin: userData.socialNetworks?.linkedin || '',
        },
      });
    }
  }, [user, profile]);

  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {
      name: validateName(formData.name),
      description: validateDescription(formData.description),
      ...validateSocialNetworks(formData.socialNetworks),
    };

    setErrors(newErrors);
    return !hasFormErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile.mutateAsync({
        name: formData.name,
        description: formData.description,
        socialNetworks: formData.socialNetworks,
      });
      alert('¡Perfil actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProfileFormData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando perfil...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Actualizar Perfil</h2>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nombre Completo *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ingresa tu nombre completo"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Campos de solo lectura para información académica */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={(user || profile)?.email || ''}
          disabled
          readOnly
          title="Campo de solo lectura"
          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
        />
        <p className="text-gray-500 text-xs mt-1">
          El email no se puede modificar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facultad
          </label>
          <input
            type="text"
            value={(user || profile)?.facultyId?.name || 'No especificada'}
            disabled
            readOnly
            title="Campo de solo lectura - Contacta al administrador para cambiar"
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
          />
          <p className="text-gray-500 text-xs mt-1">
            Contacta al administrador para cambiar
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carrera
          </label>
          <input
            type="text"
            value={(user || profile)?.careerId?.name || 'No especificada'}
            disabled
            readOnly
            title="Campo de solo lectura - Contacta al administrador para cambiar"
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
          />
          <p className="text-gray-500 text-xs mt-1">
            Contacta al administrador para cambiar
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Descripción
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Cuéntanos sobre ti..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          {formData.description.length}/500 caracteres
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Redes Sociales
        </h3>

        <div className="mb-4">
          <label
            htmlFor="instagram"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Instagram URL
          </label>
          <input
            type="url"
            id="instagram"
            value={formData.socialNetworks.instagram}
            onChange={(e) =>
              handleInputChange('socialNetworks.instagram', e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.instagram ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://instagram.com/username"
          />
          {errors.instagram && (
            <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="facebook"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Facebook URL
          </label>
          <input
            type="url"
            id="facebook"
            value={formData.socialNetworks.facebook}
            onChange={(e) =>
              handleInputChange('socialNetworks.facebook', e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.facebook ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://facebook.com/username"
          />
          {errors.facebook && (
            <p className="text-red-500 text-sm mt-1">{errors.facebook}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="linkedin"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedin"
            value={formData.socialNetworks.linkedin}
            onChange={(e) =>
              handleInputChange('socialNetworks.linkedin', e.target.value)
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.linkedin ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://linkedin.com/in/username"
          />
          {errors.linkedin && (
            <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Actualizando...' : 'Actualizar Perfil'}
      </button>
    </form>
  );
}
