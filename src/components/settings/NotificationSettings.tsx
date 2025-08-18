'use client';

import { useState, useEffect } from 'react';
import { useNotificationPreferences } from '@/hooks/useNotifications';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Phone, Save } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationSettings() {
  const { preferences, loading, updatePreferences } =
    useNotificationPreferences();
  const [formData, setFormData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    phoneNumber: '',
    notificationTypes: {
      orders: true,
      payments: true,
      reviews: true,
      chats: true,
      system: true,
    },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFormData({
        emailNotifications: preferences.emailNotifications,
        pushNotifications: preferences.pushNotifications,
        smsNotifications: preferences.smsNotifications,
        phoneNumber: preferences.phoneNumber || '',
        notificationTypes: preferences.notificationTypes,
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePreferences(formData);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationTypeChange = (type: string, enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: enabled,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Configuración de Notificaciones
        </h2>
        <p className="text-gray-600">
          Personaliza cómo y cuándo quieres recibir notificaciones
        </p>
      </div>

      {/* Métodos de Notificación */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Métodos de Notificación
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-sm font-medium">
                  Notificaciones por Email
                </Label>
                <p className="text-xs text-gray-500">
                  Recibe notificaciones en tu correo electrónico
                </p>
              </div>
            </div>
            <Switch
              checked={formData.emailNotifications}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  emailNotifications: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-sm font-medium">
                  Notificaciones Push
                </Label>
                <p className="text-xs text-gray-500">
                  Recibe notificaciones en tiempo real en el navegador
                </p>
              </div>
            </div>
            <Switch
              checked={formData.pushNotifications}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, pushNotifications: checked }))
              }
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium">
                    Notificaciones SMS
                  </Label>
                  <p className="text-xs text-gray-500">
                    Recibe notificaciones importantes por mensaje de texto
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.smsNotifications}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    smsNotifications: checked,
                  }))
                }
              />
            </div>

            {formData.smsNotifications && (
              <div className="ml-8">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Número de Teléfono
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+593 99 123 4567"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tipos de Notificación */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tipos de Notificación
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Órdenes</Label>
              <p className="text-xs text-gray-500">
                Nuevas órdenes, cambios de estado, completadas
              </p>
            </div>
            <Switch
              checked={formData.notificationTypes.orders}
              onCheckedChange={(checked) =>
                handleNotificationTypeChange('orders', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Pagos</Label>
              <p className="text-xs text-gray-500">
                Pagos recibidos, confirmaciones, rechazos
              </p>
            </div>
            <Switch
              checked={formData.notificationTypes.payments}
              onCheckedChange={(checked) =>
                handleNotificationTypeChange('payments', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Reseñas</Label>
              <p className="text-xs text-gray-500">
                Nuevas reseñas en tus servicios
              </p>
            </div>
            <Switch
              checked={formData.notificationTypes.reviews}
              onCheckedChange={(checked) =>
                handleNotificationTypeChange('reviews', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Mensajes</Label>
              <p className="text-xs text-gray-500">Nuevos mensajes en chats</p>
            </div>
            <Switch
              checked={formData.notificationTypes.chats}
              onCheckedChange={(checked) =>
                handleNotificationTypeChange('chats', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Sistema</Label>
              <p className="text-xs text-gray-500">
                Actualizaciones del sistema, mantenimiento
              </p>
            </div>
            <Switch
              checked={formData.notificationTypes.system}
              onCheckedChange={(checked) =>
                handleNotificationTypeChange('system', checked)
              }
            />
          </div>
        </div>
      </Card>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
}
