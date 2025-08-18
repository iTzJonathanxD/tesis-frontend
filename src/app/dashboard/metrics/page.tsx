'use client';

import { useSellerMetrics } from '@/hooks/useSellerMetrics';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import {
  DollarSign,
  Package,
  Star,
  TrendingUp,
  ShoppingBag,
  Users,
  Calendar,
  Award,
  Clock,
} from 'lucide-react';

export default function SellerMetricsPage() {
  const { metrics, isLoading } = useSellerMetrics();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudieron cargar las métricas</p>
      </div>
    );
  }

  const { statistics, topServices, monthlyEarnings } = metrics;

  const mainStats = [
    {
      name: 'Ventas Totales',
      value: statistics.totalSales,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Ganancias Totales',
      value: `$${statistics.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+18%',
    },
    {
      name: 'Servicios Activos',
      value: statistics.activeServices,
      icon: Package,
      color: 'bg-purple-500',
      change: '+5%',
    },
    {
      name: 'Calificación Promedio',
      value: statistics.averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-500',
      change: '+0.2',
    },
  ];

  const orderStats = [
    {
      name: 'Órdenes Completadas',
      value: statistics.completedOrders,
      icon: ShoppingBag,
      color: 'text-green-600',
    },
    {
      name: 'Órdenes Pendientes',
      value: statistics.pendingOrders,
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Métricas</h1>
        <p className="text-gray-600">Resumen de tu rendimiento como vendedor</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orderStats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top Services */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Servicios Más Exitosos
        </h3>
        <div className="space-y-4">
          {topServices.slice(0, 5).map((service, index) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      #{index + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {service.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{service.totalSales} ventas</span>
                    <span>${service.totalEarnings.toLocaleString()}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {service.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Earnings Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Ganancias Mensuales
          </h3>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {monthlyEarnings.slice(-6).map((month) => (
            <div
              key={month.month}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900 w-16">
                  {month.month}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (month.earnings /
                          Math.max(...monthlyEarnings.map((m) => m.earnings))) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ${month.earnings.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {month.sales} ventas
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Rendimiento</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tasa de conversión</span>
              <span className="text-sm font-medium text-gray-900">
                {(
                  (statistics.completedOrders /
                    (statistics.completedOrders + statistics.pendingOrders)) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Ganancia promedio por venta
              </span>
              <span className="text-sm font-medium text-gray-900">
                $
                {statistics.totalSales > 0
                  ? (statistics.totalEarnings / statistics.totalSales).toFixed(
                      0
                    )
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Servicios por calificación 5★
              </span>
              <span className="text-sm font-medium text-gray-900">
                {topServices.filter((s) => s.rating >= 4.5).length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Actividad Reciente
            </h3>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">
                {statistics.completedOrders}
              </span>{' '}
              órdenes completadas este mes
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">
                {statistics.activeServices}
              </span>{' '}
              servicios activos
            </div>
            <div className="text-sm text-gray-600">
              Calificación promedio de{' '}
              <span className="font-medium text-gray-900">
                {statistics.averageRating.toFixed(1)}★
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
