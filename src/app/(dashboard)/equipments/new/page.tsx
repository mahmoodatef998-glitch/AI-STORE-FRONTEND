'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { equipmentAPI } from '@/lib/api';
import { Equipment } from '@/types';
import { EquipmentForm } from '@/components/equipments/EquipmentForm';
import { Card } from '@/components/ui/Card';

export default function NewEquipmentPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Wait for auth to load, then check if admin
    if (!authLoading && (!user || !isAdmin())) {
      router.push('/equipments');
    }
  }, [authLoading, user, isAdmin, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If not admin, don't show the form (will redirect)
  if (!user || !isAdmin()) {
    return null;
  }

  const handleSubmit = async (data: Partial<Equipment>) => {
    try {
      setLoading(true);
      // Calculate total quantity: current available + new quantity to add
      const totalQuantity = (data.quantity_available || 0) + (data.quantity_total || 0);
      
      await equipmentAPI.create({
        ...data,
        quantity_total: totalQuantity,
        // quantity_available stays as current stock
      });
      router.push('/equipments');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create equipment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Equipment</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new equipment record
        </p>
      </div>

      <Card>
        <EquipmentForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/equipments')}
          loading={loading}
        />
      </Card>
    </div>
  );
}

