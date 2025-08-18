'use client';

import { useState } from 'react';
import { useAcademic } from '@/hooks/useAcademic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  GraduationCap,
  Database,
  Trash,
} from 'lucide-react';
import { Faculty, Career } from '@/types';
import { toast } from 'sonner';

export default function AdminAcademicPage() {
  const {
    faculties,
    careers,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    createCareer,
    updateCareer,
    deleteCareer,
    seedAcademicData,
    clearAcademicData,
    isLoading,
  } = useAcademic();

  const [activeTab, setActiveTab] = useState<'faculties' | 'careers'>(
    'faculties'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Faculty | Career | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    facultyId: '',
    isActive: true,
  });

  const filteredFaculties = faculties.filter(
    (faculty: Faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCareers = careers.filter(
    (career: Career) =>
      career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (activeTab === 'faculties') {
        if (editingItem) {
          await updateFaculty.mutateAsync({
            id: editingItem._id,
            data: {
              name: formData.name,
              description: formData.description,
              isActive: formData.isActive,
            },
          });
          toast.success('Facultad actualizada exitosamente');
        } else {
          await createFaculty.mutateAsync({
            name: formData.name,
            description: formData.description,
            isActive: formData.isActive,
          });
          toast.success('Facultad creada exitosamente');
        }
      } else {
        if (editingItem) {
          await updateCareer.mutateAsync({
            id: editingItem._id,
            data: {
              name: formData.name,
              description: formData.description,
              facultyId: formData.facultyId,
            },
          });
          toast.success('Carrera actualizada exitosamente');
        } else {
          await createCareer.mutateAsync({
            name: formData.name,
            description: formData.description,
            facultyId: formData.facultyId,
            isActive: true
          });
          toast.success('Carrera creada exitosamente');
        }
      }

      handleCancel();
    } catch (error) {
      toast.error(
        `Error al guardar ${activeTab === 'faculties' ? 'facultad' : 'carrera'}`
      );
    }
  };

  const handleEdit = (item: Faculty | Career) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      code: '',
      facultyId: 'faculty' in item ? item.faculty._id : '',
      isActive: item.isActive,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (itemId: string) => {
    const itemType = activeTab === 'faculties' ? 'facultad' : 'carrera';
    if (confirm(`¿Estás seguro de que quieres eliminar esta ${itemType}?`)) {
      try {
        if (activeTab === 'faculties') {
          await deleteFaculty.mutateAsync(itemId);
        } else {
          await deleteCareer.mutateAsync(itemId);
        }
        toast.success(
          `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
          } eliminada exitosamente`
        );
      } catch (error) {
        toast.error(`Error al eliminar ${itemType}`);
      }
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      code: '',
      facultyId: '',
      isActive: true,
    });
  };

  const handleSeedData = async () => {
    if (
      confirm(
        '¿Estás seguro de que quieres cargar datos de ejemplo? Esto creará facultades y carreras predefinidas.'
      )
    ) {
      try {
        await seedAcademicData.mutateAsync();
        toast.success('Datos académicos cargados exitosamente');
      } catch (error) {
        toast.error('Error al cargar datos académicos');
      }
    }
  };

  const handleClearData = async () => {
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar TODOS los datos académicos? Esta acción no se puede deshacer.'
      )
    ) {
      try {
        await clearAcademicData.mutateAsync();
        toast.success('Datos académicos eliminados exitosamente');
      } catch (error) {
        toast.error('Error al eliminar datos académicos');
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión Académica
          </h1>
          <p className="text-gray-600">Administra facultades y carreras</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSeedData}
            disabled={seedAcademicData.isPending}
          >
            <Database className="h-4 w-4 mr-2" />
            Cargar Datos
          </Button>
          <Button
            variant="outline"
            onClick={handleClearData}
            disabled={clearAcademicData.isPending}
          >
            <Trash className="h-4 w-4 mr-2" />
            Limpiar Datos
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo {activeTab === 'faculties' ? 'Facultad' : 'Carrera'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-6">
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'faculties' ? 'default' : 'outline'}
            onClick={() => setActiveTab('faculties')}
            className="flex items-center"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Facultades ({faculties.length})
          </Button>
          <Button
            variant={activeTab === 'careers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('careers')}
            className="flex items-center"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Carreras ({careers.length})
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={`Buscar ${
              activeTab === 'faculties' ? 'facultades' : 'carreras'
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">
            {editingItem ? 'Editar' : 'Nuevo'}{' '}
            {activeTab === 'faculties' ? 'Facultad' : 'Carrera'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              {activeTab === 'careers' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facultad
                  </label>
                  <select
                    value={formData.facultyId}
                    onChange={(e) =>
                      setFormData({ ...formData, facultyId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar facultad</option>
                    {faculties.map((faculty: Faculty) => (
                      <option key={faculty._id} value={faculty._id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={
                  createFaculty.isPending ||
                  updateFaculty.isPending ||
                  createCareer.isPending ||
                  updateCareer.isPending
                }
              >
                {editingItem ? 'Actualizar' : 'Crear'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'faculties'
          ? filteredFaculties.map((faculty: Faculty) => (
              <Card key={faculty._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faculty.name}
                    </h3>
                  </div>
                  <Badge variant={faculty.isActive ? 'default' : 'secondary'}>
                    {faculty.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {faculty.description}
                </p>

                <div className="text-sm text-gray-500 mb-4">
                  Carreras:{' '}
                  {careers.filter((c) => c.faculty._id === faculty._id).length}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(faculty)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(faculty._id)}
                    disabled={deleteFaculty.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          : filteredCareers.map((career: Career) => (
              <Card key={career._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {career.name}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {career.description}
                </p>

                <div className="text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {career.faculty.name}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(career)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(career._id)}
                    disabled={deleteCareer.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
      </div>

      {((activeTab === 'faculties' && filteredFaculties.length === 0) ||
        (activeTab === 'careers' && filteredCareers.length === 0)) && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No se encontraron{' '}
            {activeTab === 'faculties' ? 'facultades' : 'carreras'}
          </p>
        </div>
      )}
    </div>
  );
}
