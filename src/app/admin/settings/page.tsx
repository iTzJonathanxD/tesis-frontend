'use client';

// Forzar la renderización dinámica para evitar prerenderizado
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Settings,
  Save,
  Database,
  Mail,
  Shield,
  Globe,
  Bell,
  Palette,
  Server,
  Key,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'general' | 'email' | 'security' | 'notifications' | 'system'
  >('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'ULEAM Conecta',
      siteDescription: 'Plataforma de servicios estudiantiles',
      siteUrl: 'https://uleamconecta.com',
      contactEmail: 'admin@uleamconecta.com',
      supportEmail: 'soporte@uleamconecta.com',
      maintenanceMode: false,
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUser: 'noreply@uleamconecta.com',
      smtpPassword: '••••••••',
      fromName: 'ULEAM Conecta',
      fromEmail: 'noreply@uleamconecta.com',
    },
    security: {
      requireEmailVerification: true,
      allowPasswordReset: true,
      sessionTimeout: '24',
      maxLoginAttempts: '5',
      passwordMinLength: '8',
      requireStrongPassword: true,
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      paymentNotifications: true,
      reviewNotifications: true,
      systemNotifications: true,
      marketingEmails: false,
    },
    system: {
      maxFileSize: '10',
      allowedFileTypes: 'jpg,jpeg,png,webp,gif',
      cacheTimeout: '3600',
      apiRateLimit: '100',
      backupFrequency: 'daily',
      logLevel: 'info',
    },
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (
    category: keyof typeof settings,
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'system', name: 'Sistema', icon: Server },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Configuración del Sistema
          </h1>
          <p className="text-gray-600">
            Administra la configuración general de la plataforma
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Configuración General
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Sitio
                      </label>
                      <Input
                        value={settings.general.siteName}
                        onChange={(e) =>
                          updateSetting('general', 'siteName', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL del Sitio
                      </label>
                      <Input
                        value={settings.general.siteUrl}
                        onChange={(e) =>
                          updateSetting('general', 'siteUrl', e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción del Sitio
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) =>
                          updateSetting(
                            'general',
                            'siteDescription',
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de Contacto
                      </label>
                      <Input
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) =>
                          updateSetting(
                            'general',
                            'contactEmail',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de Soporte
                      </label>
                      <Input
                        type="email"
                        value={settings.general.supportEmail}
                        onChange={(e) =>
                          updateSetting(
                            'general',
                            'supportEmail',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.general.maintenanceMode}
                        onChange={(e) =>
                          updateSetting(
                            'general',
                            'maintenanceMode',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Modo de Mantenimiento
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Configuración de Email
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Servidor SMTP
                      </label>
                      <Input
                        value={settings.email.smtpHost}
                        onChange={(e) =>
                          updateSetting('email', 'smtpHost', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puerto SMTP
                      </label>
                      <Input
                        value={settings.email.smtpPort}
                        onChange={(e) =>
                          updateSetting('email', 'smtpPort', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usuario SMTP
                      </label>
                      <Input
                        value={settings.email.smtpUser}
                        onChange={(e) =>
                          updateSetting('email', 'smtpUser', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña SMTP
                      </label>
                      <Input
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) =>
                          updateSetting('email', 'smtpPassword', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Remitente
                      </label>
                      <Input
                        value={settings.email.fromName}
                        onChange={(e) =>
                          updateSetting('email', 'fromName', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email del Remitente
                      </label>
                      <Input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) =>
                          updateSetting('email', 'fromEmail', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Configuración de Seguridad
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiempo de Sesión (horas)
                        </label>
                        <Input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) =>
                            updateSetting(
                              'security',
                              'sessionTimeout',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Máx. Intentos de Login
                        </label>
                        <Input
                          type="number"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) =>
                            updateSetting(
                              'security',
                              'maxLoginAttempts',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitud Mín. Contraseña
                        </label>
                        <Input
                          type="number"
                          value={settings.security.passwordMinLength}
                          onChange={(e) =>
                            updateSetting(
                              'security',
                              'passwordMinLength',
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireEmailVerification}
                          onChange={(e) =>
                            updateSetting(
                              'security',
                              'requireEmailVerification',
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Requerir verificación de email
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.allowPasswordReset}
                          onChange={(e) =>
                            updateSetting(
                              'security',
                              'allowPasswordReset',
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Permitir recuperación de contraseña
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.security.requireStrongPassword}
                          onChange={(e) =>
                            updateSetting(
                              'security',
                              'requireStrongPassword',
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Requerir contraseñas seguras
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Configuración de Notificaciones
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) =>
                          updateSetting(
                            'notifications',
                            'emailNotifications',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Notificaciones por email
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.orderNotifications}
                        onChange={(e) =>
                          updateSetting(
                            'notifications',
                            'orderNotifications',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Notificaciones de órdenes
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.paymentNotifications}
                        onChange={(e) =>
                          updateSetting(
                            'notifications',
                            'paymentNotifications',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Notificaciones de pagos
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.reviewNotifications}
                        onChange={(e) =>
                          updateSetting(
                            'notifications',
                            'reviewNotifications',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Notificaciones de reseñas
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.systemNotifications}
                        onChange={(e) =>
                          updateSetting(
                            'notifications',
                            'systemNotifications',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Notificaciones del sistema
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.marketingEmails}
                        onChange={(e) =>
                          updateSetting(
                            'notifications',
                            'marketingEmails',
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Emails de marketing
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Configuración del Sistema
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tamaño Máx. Archivo (MB)
                      </label>
                      <Input
                        type="number"
                        value={settings.system.maxFileSize}
                        onChange={(e) =>
                          updateSetting('system', 'maxFileSize', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipos de Archivo Permitidos
                      </label>
                      <Input
                        value={settings.system.allowedFileTypes}
                        onChange={(e) =>
                          updateSetting(
                            'system',
                            'allowedFileTypes',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timeout de Cache (seg)
                      </label>
                      <Input
                        type="number"
                        value={settings.system.cacheTimeout}
                        onChange={(e) =>
                          updateSetting(
                            'system',
                            'cacheTimeout',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Límite de API (req/min)
                      </label>
                      <Input
                        type="number"
                        value={settings.system.apiRateLimit}
                        onChange={(e) =>
                          updateSetting(
                            'system',
                            'apiRateLimit',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frecuencia de Backup
                      </label>
                      <select
                        value={settings.system.backupFrequency}
                        onChange={(e) =>
                          updateSetting(
                            'system',
                            'backupFrequency',
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hourly">Cada hora</option>
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nivel de Log
                      </label>
                      <select
                        value={settings.system.logLevel}
                        onChange={(e) =>
                          updateSetting('system', 'logLevel', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
