'use client';

import { useUsers } from '@/hooks/useUsers';
import { useServices } from '@/hooks/useServices';
import { useOrders } from '@/hooks/useOrders';
import { usePayments } from '@/hooks/usePayments';
import { Card } from '@/components/ui/card';
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
} from 'lucide-react';

export default function AdminMetricsPage() {
  const { users } = useUsers();
  const { getServices } = useServices();
  const { orders } = useOrders();
  const { statistics } = usePayments();

  const services = getServices.data || [];

  // Calculate metrics
  const totalRevenue = statistics?.totalAmount || 0;
  const activeUsers = users.filter((u) => u.isActive).length;
  const verifiedUsers = users.filter((u) => u.isVerified).length;
  const activeServices = services.filter(
    (s: any) => s.status === 'active'
  ).length;
  const completedOrders = orders.filter(
    (o: any) => o.status === 'completed'
  ).length;
  const pendingOrders = orders.filter(
    (o: any) => o.status === 'pending'
  ).length;

  // Growth calculations (mock data for demonstration)
  const userGrowth = '+12%';
  const serviceGrowth = '+8%';
  const orderGrowth = '+15%';
  const revenueGrowth = '+22%';

  const mainMetrics = [
    {
      name: 'Usuarios Totales',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500',
      change: userGrowth,
      changeType: 'positive' as const,
    },
    {
      name: 'Servicios Activos',
      value: activeServices,
      icon: Package,
      color: 'bg-green-500',
      change: serviceGrowth,
      changeType: 'positive' as const,
    },
    {
      name: 'Órdenes Completadas',
      value: completedOrders,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      change: orderGrowth,
      changeType: 'positive' as const,
    },
    {
      name: 'Ingresos Totales',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: revenueGrowth,
      changeType: 'positive' as const,
    },
  ];

  const detailedMetrics = [
    {
      category: 'Usuarios',
      metrics: [
        { name: 'Usuarios Activos', value: activeUsers, total: users.length },
        {
          name: 'Usuarios Verificados',
          value: verifiedUsers,
          total: users.length,
        },
        {
          name: 'Nuevos este mes',
          value: Math.floor(users.length * 0.15),
          total: users.length,
        },
      ],
    },
    {
      category: 'Servicios',
      metrics: [
        {
          name: 'Servicios Activos',
          value: activeServices,
          total: services.length,
        },
        {
          name: 'Servicios Inactivos',
          value: services.length - activeServices,
          total: services.length,
        },
        {
          name: 'Promedio Rating',
          value: 4.2,
          total: 5,
          isRating: true as boolean,
        },
      ],
    },
    {
      category: 'Órdenes',
      metrics: [
        { name: 'Completadas', value: completedOrders, total: orders.length },
        { name: 'Pendientes', value: pendingOrders, total: orders.length },
        {
          name: 'Canceladas',
          value: orders.filter((o: any) => o.status === 'cancelled').length,
          total: orders.length,
        },
      ],
    },
    {
      category: 'Pagos',
      metrics: [
        {
          name: 'Pagos Confirmados',
          value: statistics?.confirmedPayments || 0,
          total: statistics?.totalPayments || 0,
        },
        {
          name: 'Pagos Pendientes',
          value: statistics?.pendingPayments || 0,
          total: statistics?.totalPayments || 0,
        },
        {
          name: 'Pagos Rechazados',
          value: statistics?.rejectedPayments || 0,
          total: statistics?.totalPayments || 0,
        },
      ],
    },
  ];

  // Mock monthly data for charts
  const monthlyData = [
    { month: 'Ene', users: 45, services: 12, orders: 28, revenue: 1200 },
    { month: 'Feb', users: 52, services: 18, orders: 35, revenue: 1800 },
    { month: 'Mar', users: 61, services: 25, orders: 42, revenue: 2400 },
    { month: 'Abr', users: 68, services: 31, orders: 48, revenue: 2900 },
    { month: 'May', users: 75, services: 38, orders: 55, revenue: 3500 },
    { month: 'Jun', users: 82, services: 44, orders: 62, revenue: 4100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Métricas y Análisis
        </h1>
        <p className="text-gray-600">
          Resumen completo del rendimiento del sistema
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map((metric) => (
          <Card key={metric.name} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {metric.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {typeof metric.value === 'string'
                        ? metric.value
                        : metric.value.toLocaleString()}
                    </div>
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        metric.changeType === 'positive'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {metric.changeType === 'positive' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {metric.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {detailedMetrics.map((category) => (
          <Card key={category.category} className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {category.category}
            </h3>
            <div className="space-y-4">
              {category.metrics.map((metric) => (
                <div
                  key={metric.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">{metric.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {(metric as any).isRating
                        ? metric.value.toFixed(1)
                        : metric.value.toLocaleString()}
                      {metric.total && !(metric as any).isRating && (
                        <span className="text-gray-500">
                          /{metric.total.toLocaleString()}
                        </span>
                      )}
                    </span>
                    {metric.total && (
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(metric.value / metric.total) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Monthly Trends */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Tendencias Mensuales
          </h3>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">Últimos 6 meses</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Usuarios</h4>
            <div className="space-y-2">
              {monthlyData.map((data) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-500">{data.month}</span>
                  <span className="text-sm font-medium">{data.users}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Servicios
            </h4>
            <div className="space-y-2">
              {monthlyData.map((data) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-500">{data.month}</span>
                  <span className="text-sm font-medium">{data.services}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Órdenes</h4>
            <div className="space-y-2">
              {monthlyData.map((data) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-500">{data.month}</span>
                  <span className="text-sm font-medium">{data.orders}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Ingresos</h4>
            <div className="space-y-2">
              {monthlyData.map((data) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-500">{data.month}</span>
                  <span className="text-sm font-medium">${data.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Crecimiento</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Los usuarios han crecido un{' '}
              <span className="font-semibold text-green-600">12%</span> este mes
            </p>
            <p className="text-sm text-gray-600">
              Los servicios activos aumentaron{' '}
              <span className="font-semibold text-green-600">8%</span>
            </p>
            <p className="text-sm text-gray-600">
              Las órdenes completadas subieron{' '}
              <span className="font-semibold text-green-600">15%</span>
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Esta Semana</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">5</span> nuevos usuarios
              registrados
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">12</span> servicios publicados
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">28</span> órdenes procesadas
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Top Categorías
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tutorías</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Proyectos</span>
              <span className="text-sm font-medium">28%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Diseño</span>
              <span className="text-sm font-medium">22%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Forzar la renderización dinámica para evitar prerenderizado
export const dynamic = 'force-dynamic';
