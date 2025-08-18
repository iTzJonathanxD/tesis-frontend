'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useServices } from '@/hooks/useServices';
import { useFaculties, useCareers, useCategories } from '@/hooks/useAcademic';
import { toast } from 'sonner';

const CreateService = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { createService } = useServices();
  const { faculties } = useFaculties();
  const { categories } = useCategories();
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const {
    careers,
    loading: careersLoading,
    error: careersError,
  } = useCareers(selectedFaculty);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    facultyId: '',
    careerId: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setFormData((prev) => ({ ...prev, careerId: '' })); // Reset career
      console.log('Faculty selected:', value); // Debug log
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length > 5) {
      toast.error('Máximo 5 imágenes permitidas');
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} no es una imagen válida`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error(`${file.name} es muy grande (máximo 10MB)`);
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

    if (!formData.price) {
      newErrors.price = 'El precio es requerido';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida';
    }

    if (!formData.facultyId) {
      newErrors.facultyId = 'La facultad es requerida';
    }

    if (!formData.careerId) {
      newErrors.careerId = 'La carrera es requerida';
    }

    if (images.length === 0) {
      newErrors.images = 'Al menos una imagen es requerida';
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
      await createService.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        categoryId: formData.categoryId,
        facultyId: formData.facultyId,
        careerId: formData.careerId,
        images,
      });

      toast.success('Servicio creado exitosamente');
      router.push('/dashboard/services');
    } catch (error) {
      console.error('Error creating service:', error);
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
            Debes iniciar sesión para crear servicios
          </p>
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prepare options for selects
  const facultyOptions = [
    { value: '', label: 'Selecciona una facultad' },
    ...(Array.isArray(faculties)
      ? faculties.map((faculty) => ({
          value: faculty._id,
          label: faculty.name,
        }))
      : []),
  ];
  const careerOptions = [
    {
      value: '',
      label: careersLoading
        ? 'Cargando carreras...'
        : careersError
        ? 'Error al cargar carreras'
        : !selectedFaculty
        ? 'Primero selecciona una facultad'
        : careers.length === 0
        ? 'No hay carreras disponibles'
        : 'Selecciona una carrera',
    },
    ...(Array.isArray(careers)
      ? careers.map((career) => ({
          value: career._id,
          label: career.name,
        }))
      : []),
  ];

  const categoryOptions = [
    { value: '', label: 'Selecciona una categoría' },
    ...(Array.isArray(categories)
      ? categories.map((category) => ({
          value: category._id,
          label: category.name,
        }))
      : []),
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Crear Nuevo Servicio
              </h1>
              <p className="text-gray-600 mt-1">
                Comparte tus habilidades con la comunidad ULEAM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
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
                    error={errors.title}
                    placeholder="Ej: Tutoría de Matemáticas - Cálculo Diferencial"
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Descripción Detallada
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-500 resize-none transition-all duration-300 hover:border-gray-400 hover:shadow-md focus:shadow-lg text-sm"
                      placeholder="Describe detalladamente tu servicio, qué incluye, metodología, experiencia, etc. (mínimo 50 caracteres)"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formData.description.length}/1000 caracteres
                    </p>
                  </div>

                  <AnimatedInput
                    label="Precio (USD)"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    error={errors.price}
                    placeholder="25.00"
                    icon={<DollarSign className="h-4 w-4" />}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Academic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Información Académica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatedSelect
                      label="Facultad"
                      name="facultyId"
                      value={formData.facultyId}
                      onChange={handleInputChange}
                      error={errors.facultyId}
                      options={facultyOptions}
                    />

                    <div>
                      <AnimatedSelect
                        label="Carrera"
                        name="careerId"
                        value={formData.careerId}
                        onChange={handleInputChange}
                        error={errors.careerId}
                        options={careerOptions}
                        disabled={!selectedFaculty || careersLoading}
                      />
                      {careersError && (
                        <p className="text-red-500 text-xs mt-1">
                          {careersError}
                        </p>
                      )}
                      {selectedFaculty &&
                        !careersLoading &&
                        careers.length === 0 && (
                          <p className="text-yellow-600 text-xs mt-1">
                            No se encontraron carreras para esta facultad
                          </p>
                        )}
                    </div>
                  </div>

                  <AnimatedSelect
                    label="Categoría del Servicio"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    error={errors.categoryId}
                    options={categoryOptions}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Imágenes del Servicio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Sube imágenes de tu servicio
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Arrastra y suelta archivos aquí, o haz clic para
                        seleccionar
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP hasta 10MB cada una (máximo 5 imágenes)
                      </p>
                    </label>
                  </div>

                  {errors.images && (
                    <p className="text-red-500 text-sm">{errors.images}</p>
                  )}

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end space-x-4"
            >
              <Link href="/dashboard">
                <Button variant="outline" disabled={loading}>
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Servicio
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
