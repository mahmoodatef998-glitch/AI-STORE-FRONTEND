'use client';

import { useEffect, useState } from 'react';
import { useEquipments } from '@/hooks/useEquipments';
import { equipmentAPI, notificationAPI, predictionAPI } from '@/lib/api';
import { Equipment, Notification } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { LowStockAlerts } from '@/components/dashboard/LowStockAlerts';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PredictionChart } from '@/components/dashboard/PredictionChart';

export default function DashboardPage() {
  const { equipments, loading: equipmentsLoading } = useEquipments();
  const [lowStockEquipments, setLowStockEquipments] = useState<Equipment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [lowStock, notifs] = await Promise.all([
          equipmentAPI.getLowStock(),
          notificationAPI.getAll(undefined, false),
        ]);
        setLowStockEquipments(lowStock);
        setNotifications(notifs.slice(0, 5)); // Get latest 5
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || equipmentsLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const totalEquipments = equipments.length;
  const totalValue = equipments.reduce(
    (sum, eq) => sum + (eq.unit_price || 0) * eq.quantity_total,
    0
  );
  const lowStockCount = lowStockEquipments.length;
  const totalAvailable = equipments.reduce((sum, eq) => sum + eq.quantity_available, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your equipment inventory
        </p>
      </div>

      <StatsCards
        totalEquipments={totalEquipments}
        totalValue={totalValue}
        lowStockCount={lowStockCount}
        totalAvailable={totalAvailable}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlerts equipments={lowStockEquipments} />
        <Card title="Recent Notifications">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent notifications</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-gray-900">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <PredictionChart equipments={equipments.slice(0, 5)} />
    </div>
  );
}

