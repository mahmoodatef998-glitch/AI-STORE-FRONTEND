'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { orderAPI, equipmentAPI } from '@/lib/api';
import { Order, OrderMaterial, Equipment, CreateOrderDto, OrderAttachment } from '@/types';
import { OrderForm } from '@/components/orders/OrderForm';
import { ReceiptUpload } from '@/components/orders/ReceiptUpload';
import { Card } from '@/components/ui/Card';

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin, loading: authLoading, user } = useAuth();
  const [order, setOrder] = useState<Order & { materials: OrderMaterial[] } | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [attachments, setAttachments] = useState<OrderAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin())) {
      router.push('/orders');
    }
  }, [authLoading, user, isAdmin, router]);

  useEffect(() => {
    const fetchData = async () => {
      // Wait for auth to be ready
      if (authLoading) return;
      
      // Check permissions
      if (!user || !isAdmin()) {
        return;
      }

      if (!params.id) {
        router.push('/orders');
        return;
      }

      try {
        setLoading(true);
        
        const [orderData, equipmentsData] = await Promise.all([
          orderAPI.getById(params.id as string),
          equipmentAPI.getAll(),
        ]);

        if (!orderData) {
          alert('Order not found');
          router.push('/orders');
          return;
        }

        setOrder(orderData);
        setEquipments(equipmentsData);
        
        // Load attachments
        try {
          const attachmentsData = await orderAPI.getAttachments(params.id as string);
          setAttachments(attachmentsData);
        } catch (attError) {
          console.error('Error loading attachments:', attError);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load order';
        alert(`Error: ${errorMessage}`);
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && isAdmin() && params.id) {
      fetchData();
    }
  }, [params.id, router, authLoading, user, isAdmin]);

  if (authLoading || loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return null;
  }

  if (!order || equipments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading order data...</div>
      </div>
    );
  }

  const handleSubmit = async (data: CreateOrderDto) => {
    try {
      setSaving(true);
      console.log('Updating order with data:', data);
      await orderAPI.update(order.id, data);
      console.log('Order updated successfully');
      router.push('/orders');
      router.refresh();
    } catch (error) {
      console.error('Error updating order:', error);
      alert(error instanceof Error ? error.message : 'Failed to update order');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Convert order materials to form format
  const initialMaterials = order.materials.map((m) => ({
    equipment_id: m.equipment_id,
    quantity: m.quantity,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Order</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update order information and materials
        </p>
      </div>

      <Card>
        <OrderForm
          equipments={equipments}
          initialData={{
            generator_model: order.generator_model,
            order_reference: order.order_reference,
            receiver_name: order.receiver_name,
            notes: order.notes || undefined,
            materials: initialMaterials,
          }}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/orders')}
          loading={saving}
        />
      </Card>

      <Card title="Receipt Files">
        <ReceiptUpload
          orderId={order.id}
          existingAttachments={attachments}
          onAttachmentDeleted={(attachmentId) => {
            setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
          }}
        />
      </Card>
    </div>
  );
}

