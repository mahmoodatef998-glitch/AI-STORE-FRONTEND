'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEquipments } from '@/hooks/useEquipments';
import { orderAPI } from '@/lib/api';
import { CreateOrderDto } from '@/types';
import { OrderForm } from '@/components/orders/OrderForm';
import { Card } from '@/components/ui/Card';

export default function CreateOrderPage() {
  const router = useRouter();
  const { equipments, loading: equipmentsLoading } = useEquipments();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: CreateOrderDto) => {
    try {
      setLoading(true);
      setSuccess(false);
      const order = await orderAPI.create(data);
      setSuccess(true);
      
      // Upload pending receipt files if any
      const pendingFiles = (window as any).__pendingReceiptFiles as File[] | undefined;
      if (pendingFiles && pendingFiles.length > 0) {
        try {
          for (const file of pendingFiles) {
            const formData = new FormData();
            formData.append('file', file);

            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/${order.id}/attachments`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
              },
              body: formData,
            });
          }
          // Clear pending files
          (window as any).__pendingReceiptFiles = [];
        } catch (uploadError) {
          console.error('Error uploading receipt files:', uploadError);
          // Don't fail the order creation if file upload fails
        }
      }
      
      // Show success message and redirect after 2 seconds
      setTimeout(() => {
        router.push('/equipments');
      }, 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  if (equipmentsLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new order and deduct materials from inventory
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ Materials successfully deducted from inventory!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Generator Image */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">⚙️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Perkins Generator</h3>
                  <p className="text-gray-600">Professional Electric Generator</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-primary-500 opacity-10 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-primary-600 opacity-5 rounded-full"></div>
            </div>
          </Card>
        </div>

        {/* Right side - Order Form */}
        <div className="lg:col-span-2">
          <Card>
            <OrderForm
              equipments={equipments}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/equipments')}
              loading={loading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

