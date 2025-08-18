'use client';

import { useState } from 'react';
import { useUpload } from '@/hooks/useUpload';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload,
  Search,
  Trash2,
  Download,
  Eye,
  Image,
  File,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUploadsPage() {
  const { uploadImage, uploadImages, deleteImage } = useUpload();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Mock data for demonstration - in real app, you'd fetch this from an API
  const [uploads, setUploads] = useState([
    {
      id: '1',
      publicId: 'sample1',
      url: 'https://via.placeholder.com/300x200',
      format: 'jpg',
      width: 300,
      height: 200,
      bytes: 15420,
      createdAt: '2024-01-15T10:30:00Z',
      name: 'service-image-1.jpg',
    },
    {
      id: '2',
      publicId: 'sample2',
      url: 'https://via.placeholder.com/400x300',
      format: 'png',
      width: 400,
      height: 300,
      bytes: 28950,
      createdAt: '2024-01-14T15:45:00Z',
      name: 'profile-photo.png',
    },
    {
      id: '3',
      publicId: 'sample3',
      url: 'https://via.placeholder.com/250x250',
      format: 'webp',
      width: 250,
      height: 250,
      bytes: 12300,
      createdAt: '2024-01-13T09:20:00Z',
      name: 'category-icon.webp',
    },
  ]);

  const filteredUploads = uploads.filter(
    (upload) =>
      upload.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Selecciona al menos un archivo');
      return;
    }

    setUploading(true);
    try {
      if (selectedFiles.length === 1) {
        const result = await uploadImage.mutateAsync(selectedFiles[0]);
        const newUpload = {
          id: Date.now().toString(),
          publicId: result.publicId,
          url: result.url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          createdAt: new Date().toISOString(),
          name: selectedFiles[0].name,
        };
        setUploads((prev) => [newUpload, ...prev]);
      } else {
        const results = await uploadImages.mutateAsync(selectedFiles);
        const newUploads = results.map((result, index) => ({
          id: (Date.now() + index).toString(),
          publicId: result.publicId,
          url: result.url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          createdAt: new Date().toISOString(),
          name: selectedFiles[index].name,
        }));
        setUploads((prev) => [...newUploads, ...prev]);
      }

      toast.success('Archivos subidos exitosamente');
      setSelectedFiles([]);
      // Reset file input
      const fileInput = document.getElementById(
        'file-input'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error('Error al subir archivos');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string, uploadId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      try {
        await deleteImage.mutateAsync(publicId);
        setUploads((prev) => prev.filter((upload) => upload.id !== uploadId));
        toast.success('Archivo eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar archivo');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return uploads.reduce((total, upload) => total + upload.bytes, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Archivos
          </h1>
          <p className="text-gray-600">
            Administra las imágenes y archivos del sistema
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <File className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Total Archivos
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {uploads.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Imágenes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  uploads.filter((u) =>
                    ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(
                      u.format.toLowerCase()
                    )
                  ).length
                }
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Upload className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Tamaño Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatFileSize(getTotalSize())}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Plus className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Este Mes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  uploads.filter((u) => {
                    const uploadDate = new Date(u.createdAt);
                    const now = new Date();
                    return (
                      uploadDate.getMonth() === now.getMonth() &&
                      uploadDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Subir Archivos
        </h3>
        <div className="space-y-4">
          <div>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Archivos seleccionados ({selectedFiles.length}):
              </p>
              <div className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Subiendo...' : 'Subir Archivos'}
          </Button>
        </div>
      </Card>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar archivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUploads.map((upload) => (
          <Card key={upload.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              {['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(
                upload.format.toLowerCase()
              ) ? (
                <img
                  src={upload.url}
                  alt={upload.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <File className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3
                className="font-medium text-sm mb-2 truncate"
                title={upload.name}
              >
                {upload.name}
              </h3>

              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <div>Formato: {upload.format.toUpperCase()}</div>
                <div>Tamaño: {formatFileSize(upload.bytes)}</div>
                <div>
                  Dimensiones: {upload.width}x{upload.height}
                </div>
                <div>
                  Subido: {new Date(upload.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(upload.publicId, upload.id)}
                  disabled={deleteImage.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUploads.length === 0 && (
        <div className="text-center py-12">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron archivos</p>
        </div>
      )}
    </div>
  );
}

// Forzar la renderización dinámica para evitar prerenderizado
export const dynamic = 'force-dynamic';
