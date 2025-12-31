'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { orderAPI, equipmentAPI } from '@/lib/api';
import { Order, OrderMaterial, Equipment } from '@/types';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersWithMaterials, setOrdersWithMaterials] = useState<
    (Order & { materials: (OrderMaterial & { equipment: Equipment | null })[] })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const [ordersData, equipmentsData] = await Promise.all([
          orderAPI.getAll(),
          equipmentAPI.getAll(),
        ]);

        // Fetch materials for each order
        const ordersWithMaterialsData = await Promise.all(
          ordersData.map(async (order) => {
            const materials = await orderAPI.getById(order.id);
            return {
              ...order,
              materials: (materials.materials || []).map((material) => ({
                ...material,
                equipment: equipmentsData.find((eq) => eq.id === material.equipment_id) || null,
              })),
            };
          })
        );

        setOrders(ordersData);
        setOrdersWithMaterials(ordersWithMaterialsData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone and will not restore stock.')) {
      return;
    }

    try {
      setDeleting(id);
      await orderAPI.delete(id);
      
      // Refresh orders list
      const [ordersData, equipmentsData] = await Promise.all([
        orderAPI.getAll(),
        equipmentAPI.getAll(),
      ]);

      const ordersWithMaterialsData = await Promise.all(
        ordersData.map(async (order) => {
          const materials = await orderAPI.getById(order.id);
          return {
            ...order,
            materials: (materials.materials || []).map((material) => ({
              ...material,
              equipment: equipmentsData.find((eq) => eq.id === material.equipment_id) || null,
            })),
          };
        })
      );

      setOrders(ordersData);
      setOrdersWithMaterials(ordersWithMaterialsData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete order');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/orders/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all orders
          </p>
        </div>
        <Link href="/create-order">
          <Button>➕ Create New Order</Button>
        </Link>
      </div>

      <OrdersTable
        orders={ordersWithMaterials}
        onEdit={isAdmin() ? handleEdit : undefined}
        onDelete={isAdmin() ? handleDelete : undefined}
        deleting={deleting}
      />
    </div>
  );
}

