'use client';

import { useState } from 'react';
import { usePayments } from '@/hooks/usePayments';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Filter,
} from 'lucide-react';
import { Payment } from '@/types';

export default function PaymentsPage() {
  const { myPayments, statistics, isLoading } = usePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'pending' | 'confirmed' | 'rejected'
  >('all');

  const filteredPayments = myPayments.filter((payment: Payment) => {
    const matchesSearch =
      payment.order.service.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.transactionReference
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || payment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'transfer':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'transfer':
        return 'Transferencia';
      case 'cash':
        return 'Efectivo';
      default:
        return method;
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
          <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
          <p className="text-gray-600">Gestiona tus pagos y transacciones</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Pagado</p>
              <p className="text-2xl font-semibold text-gray-900">
                $
                {myPayments
                  .filter((p) => p.status === 'confirmed')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {myPayments.filter((p) => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Confirmados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {myPayments.filter((p) => p.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rechazados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {myPayments.filter((p) => p.status === 'rejected').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar pagos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
            >
              Pendientes
            </Button>
            <Button
              variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('confirmed')}
              size="sm"
            >
              Confirmados
            </Button>
            <Button
              variant={filterStatus === 'rejected' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('rejected')}
              size="sm"
            >
              Rechazados
            </Button>
          </div>
        </div>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <Card className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes pagos
            </h3>
            <p className="text-gray-600">
              Los pagos que realices aparecerán aquí
            </p>
          </Card>
        ) : (
          filteredPayments.map((payment: Payment) => (
            <Card key={payment.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="text-sm font-medium text-gray-900">
                        {getPaymentMethodText(payment.paymentMethod)}
                      </span>
                    </div>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {payment.order.service.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Monto:</span> $
                        {payment.amount}
                      </div>
                      <div>
                        <span className="font-medium">Orden:</span> #
                        {payment.order.id.slice(-8)}
                      </div>
                      {payment.transactionReference && (
                        <div>
                          <span className="font-medium">Referencia:</span>{' '}
                          {payment.transactionReference}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Fecha:</span>{' '}
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Pago #{payment.id.slice(-8)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Payment Summary */}
      {myPayments.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Resumen de Pagos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                $
                {myPayments
                  .filter((p) => p.status === 'confirmed')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Confirmado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                $
                {myPayments
                  .filter((p) => p.status === 'pending')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Pendiente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                $
                {myPayments
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total General</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
