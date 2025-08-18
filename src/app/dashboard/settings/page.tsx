'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAuth as useAuthHook } from '@/hooks/useAuth';
import { useAcademic } from '@/hooks/useAcademic';
import { useLoadingOperation } from '@/hooks/useApiLoading';
import { usePageLoading } from '@/hooks/useGlobalLoading2';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  Bell,
} from 'lucide-react';
import { toast } from 'sonner';
import { NotificationSettings } from '@/components/settings/NotificationSettings';

export default function SettingsPage() {
  const { user } = useAuth();
  const { updateProfile, changePassword, uploadProfilePhoto } = useAuthHook();
  const { faculties, careers } = useAcademic();
  const { executeWithLoading } = useLoadingOperation();
  const { showLoading, hideLoading, showToastLoading, showFullscreenLoading } =
    usePageLoading();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'password' | 'notifications'
  >('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    facultyId: user?.faculty?._id || '',
    careerId: user?.career?._id || '',
    description: user?.description || '',
    socialNetworks: {
      instagram: user?.socialNetworks?.instagram || '',
      facebook: user?.socialNetworks?.facebook || '',
      linkedin: user?.socialNetworks?.linkedin || '',
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderNotifications: true,
    paymentNotifications: true,
    reviewNotifications: true,
    marketingEmails: false,
  });

  const [uploading, setUploading] = useState(false);

  // Actualizar formulario cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        facultyId: user.faculty?._id || '',
        careerId: user.career?._id || '',
        description: user.description || '',
        socialNetworks: {
          instagram: user.socialNetworks?.instagram || '',
          facebook: user.socialNetworks?.facebook || '',
          linkedin: user.socialNetworks?.linkedin || '',
        },
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    showToastLoading('Actualizando perfil...');
    try {
      // Solo enviar campos editables (excluir email, facultyId, careerId)
      const updateData = {
        name: profileForm.name,
        description: profileForm.description,
        socialNetworks: profileForm.socialNetworks,
      };
      await updateProfile.mutateAsync(updateData);
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      hideLoading();
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    showToastLoading('Cambiando contraseña...');
    try {
      await changePassword.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Contraseña actualizada exitosamente');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Error al cambiar contraseña');
    } finally {
      hideLoading();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    setUploading(true);
    showToastLoading('Subiendo foto de perfil...');
    try {
      await uploadProfilePhoto.mutateAsync(file);
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      toast.error('Error al subir foto');
    } finally {
      setUploading(false);
      hideLoading();
    }
  };

  const filteredCareers = careers.filter(
    (career) => career.faculty._id === profileForm.facultyId
  );

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'password', name: 'Contraseña', icon: Lock },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">
            Administra tu perfil, seguridad y preferencias de{' '}
            {user?.name || 'tu cuenta'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="p-6 sticky top-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración
                </h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Card className="p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Información del Perfil
                    </h3>

                    {/* Profile Photo */}
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          {user?.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt="Foto de perfil"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-gray-600" />
                          )}
                        </div>
                        <label
                          className="absolute bottom-0 right-0 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700"
                          htmlFor="photo-upload"
                        >
                          <Camera className="h-3 w-3 text-white" />
                          <Input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={uploading}
                            aria-label="Subir foto de perfil"
                          />
                        </label>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {user?.name || 'Usuario'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {user?.email || 'email@ejemplo.com'}
                        </p>
                        <p className="text-xs text-primary-600">
                          {user?.faculty?.name || 'Facultad no especificada'}
                        </p>
                        {uploading && (
                          <p className="text-sm text-blue-600">
                            Subiendo foto...
                          </p>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="full-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Nombre Completo
                          </label>
                          <Input
                            id="full-name"
                            value={profileForm.name}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            required
                            aria-label="Nombre completo"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email-address"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Correo Electrónico
                          </label>
                          <Input
                            id="email-address"
                            type="email"
                            value={profileForm.email}
                            disabled
                            readOnly
                            className="bg-gray-50 text-gray-600 cursor-not-allowed"
                            aria-label="Correo electrónico (solo lectura)"
                          />
                          <p className="text-gray-500 text-xs mt-1">
                            El correo electrónico no se puede modificar
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="faculty-display"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Facultad
                          </label>
                          <Input
                            id="faculty-display"
                            type="text"
                            value={user?.faculty?.name || 'No especificada'}
                            disabled
                            readOnly
                            className="bg-gray-50 text-gray-600 cursor-not-allowed"
                            aria-label="Facultad (solo lectura)"
                          />
                          <p className="text-gray-500 text-xs mt-1">
                            Contacta al administrador para cambiar la facultad
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="career-display"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Carrera
                          </label>
                          <Input
                            id="career-display"
                            type="text"
                            value={user?.career?.name || 'No especificada'}
                            disabled
                            readOnly
                            className="bg-gray-50 text-gray-600 cursor-not-allowed"
                            aria-label="Carrera (solo lectura)"
                          />
                          <p className="text-gray-500 text-xs mt-1">
                            Contacta al administrador para cambiar la carrera
                          </p>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="description-textarea"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Descripción
                        </label>
                        <textarea
                          id="description-textarea"
                          value={profileForm.description}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Cuéntanos sobre ti..."
                          aria-label="Descripción personal"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Redes Sociales
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label
                              htmlFor="instagram-input"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Instagram
                            </label>
                            <Input
                              id="instagram-input"
                              value={profileForm.socialNetworks.instagram}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  socialNetworks: {
                                    ...prev.socialNetworks,
                                    instagram: e.target.value,
                                  },
                                }))
                              }
                              placeholder="@usuario"
                              aria-label="Usuario de Instagram"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="facebook-input"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Facebook
                            </label>
                            <Input
                              id="facebook-input"
                              value={profileForm.socialNetworks.facebook}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  socialNetworks: {
                                    ...prev.socialNetworks,
                                    facebook: e.target.value,
                                  },
                                }))
                              }
                              placeholder="facebook.com/usuario"
                              aria-label="Perfil de Facebook"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="linkedin-input"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              LinkedIn
                            </label>
                            <Input
                              id="linkedin-input"
                              value={profileForm.socialNetworks.linkedin}
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  socialNetworks: {
                                    ...prev.socialNetworks,
                                    linkedin: e.target.value,
                                  },
                                }))
                              }
                              placeholder="linkedin.com/in/usuario"
                              aria-label="Perfil de LinkedIn"
                            />
                          </div>
                        </div>
                      </div>

                      <Button type="submit" disabled={updateProfile.isPending}>
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfile.isPending
                          ? 'Guardando...'
                          : 'Guardar Cambios'}
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Cambiar Contraseña
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label
                          htmlFor="current-password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Contraseña Actual
                        </label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            required
                            aria-label="Contraseña actual"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            aria-label={
                              showCurrentPassword
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="new-password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nueva Contraseña
                        </label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            required
                            minLength={8}
                            aria-label="Nueva contraseña"
                            aria-describedby="password-help"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            aria-label={
                              showNewPassword
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                            }
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p
                          id="password-help"
                          className="text-sm text-gray-500 mt-1"
                        >
                          Mínimo 8 caracteres
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="confirm-password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirmar Nueva Contraseña
                        </label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            required
                            aria-label="Confirmar nueva contraseña"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            aria-label={
                              showConfirmPassword
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" disabled={changePassword.isPending}>
                        <Lock className="h-4 w-4 mr-2" />
                        {changePassword.isPending
                          ? 'Cambiando...'
                          : 'Cambiar Contraseña'}
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && <NotificationSettings />}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
