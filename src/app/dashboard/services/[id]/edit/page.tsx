'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedInput } from '@/components/ui/animated-input';
import { AnimatedSelect } from '@/components/ui/animated-select';
import {
  ArrowLeft,
  Upload,
  X,
  DollarSign,
  Package,
  Image as ImageIcon,
  Save,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useServices } from '@/hooks/useServices';
import { useFaculties, useCareers, useCategories } from '@/hooks/useAcademic';
import { toast } from 'sonner';

const EditService = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;
  const { user } = useAuth();
  const { updateService, getServiceById } = useServices();
  const { faculties } = useFaculties();
  const { categories } = useCategories();

  const [selectedFaculty, setSelectedFaculty] = useState('');
  const { careers, loading: careersLoading } = useCareers(selectedFaculty);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    facultyId: '',
    careerId: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch service data
  const serviceQuery = getServiceById(serviceId);

  useEffect(() => {
    if (serviceQuery.data) {
      const service = serviceQuery.data;
      setFormData({
        title: service.title,
        description: service.description,
        price: service.price.toString(),
        categoryId: service.category._id,
        facultyId: service.faculty._id,
        careerId: service.career._id,
      });
      setSelectedFaculty(service.faculty._id);
      setExistingImages(service.images || []);
      setInitialLoading(false);
    }
  }, [serviceQuery.data]);

  useEffect(() => {
    if (serviceQuery.error) {
      toast.error('Error al cargar el servicio');
      router.push('/dashboard/services');
    }
  }, [serviceQuery.error, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Handle faculty change
    if (name === 'facultyId') {
      setSelectedFaculty(value);
      setFormData((prev) => ({ ...prev, careerId: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = images.length + existingImages.length;

    if (files.length + totalImages > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} no es una imagen válida`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} es muy grande (máximo 10MB)`);
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);

    // Create previews for new images
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 10) {
      newErrors.title = 'El título debe tener al menos 10 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 50) {
      newErrors.description =
        'La descripción debe tener al menos 50 caracteres';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Selecciona una categoría';
    }

    if (!formData.facultyId) {
      newErrors.facultyId = 'Selecciona una facultad';
    }

    if (!formData.careerId) {
      newErrors.careerId = 'Selecciona una carrera';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        images: images.length > 0 ? images : undefined,
        existingImages: existingImages,
      };

      await updateService.mutateAsync({
        id: serviceId,
        data: updateData,
      });

      toast.success('Servicio actualizado exitosamente');
      router.push('/dashboard/services');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al actualizar el servicio';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para editar servicios
          </p>
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (initialLoading || serviceQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/services">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Mis Servicios
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Servicio
              </h1>
              <p className="text-gray-600 mt-1">
                Actualiza la información de tu servicio
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Información Básica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <AnimatedInput
                      label="Título del Servicio"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ej: Desarrollo de aplicación web con React"
                      error={errors.title}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción del Servicio{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                          errors.description
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="Describe detalladamente qué incluye tu servicio, metodología, entregables, etc."
                        required
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Mínimo 50 caracteres ({formData.description.length}/50)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <AnimatedInput
                          label="Precio (USD)"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          error={errors.price}
                          icon={<DollarSign className="h-4 w-4" />}
                          required
                          min="0.01"
                          step="0.01"
                        />
                      </div>

                      <AnimatedSelect
                        label="Categoría"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        error={errors.categoryId}
                        required
                        options={[
                          { value: '', label: 'Selecciona una categoría' },
                          ...categories.map((category) => ({
                            value: category._id,
                            label: category.name,
                          })),
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatedSelect
                        label="Facultad"
                        name="facultyId"
                        value={formData.facultyId}
                        onChange={handleInputChange}
                        error={errors.facultyId}
                        required
                        options={[
                          { value: '', label: 'Selecciona una facultad' },
                          ...faculties.map((faculty) => ({
                            value: faculty._id,
                            label: faculty.name,
                          })),
                        ]}
                      />

                      <AnimatedSelect
                        label="Carrera"
                        name="careerId"
                        value={formData.careerId}
                        onChange={handleInputChange}
                        error={errors.careerId}
                        required
                        disabled={!selectedFaculty || careersLoading}
                        options={[
                          {
                            value: '',
                            label: !selectedFaculty
                              ? 'Primero selecciona una facultad'
                              : careersLoading
                              ? 'Cargando carreras...'
                              : 'Selecciona una carrera',
                          },
                          ...careers.map((career) => ({
                            value: career._id,
                            label: career.name,
                          })),
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Imágenes del Servicio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Imágenes actuales:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {existingImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={image}
                                alt={`Imagen ${index + 1}`}
                                width={200}
                                height={150}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, true)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Eliminar imagen"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images Preview */}
                    {imagePreviews.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Nuevas imágenes:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={preview}
                                alt={`Nueva imagen ${index + 1}`}
                                width={200}
                                height={150}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, false)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Eliminar nueva imagen"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    {existingImages.length + images.length < 5 && (
                      <div>
                        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-600">
                            Haz clic para subir nuevas imágenes o arrastra y
                            suelta
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG hasta 10MB. Máximo{' '}
                            {5 - existingImages.length - images.length} imágenes
                            más.
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Actualizar Servicio</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Actualizar Servicio
                        </>
                      )}
                    </Button>

                    <Link href="/dashboard/services">
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                      >
                        Cancelar
                      </Button>
                    </Link>

                    <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                      <p>• Asegúrate de que toda la información sea precisa</p>
                      <p>• Las imágenes ayudan a atraer más clientes</p>
                      <p>• Los cambios se reflejarán inmediatamente</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;
