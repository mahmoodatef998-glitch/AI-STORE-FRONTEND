'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { equipmentAPI } from '@/lib/api';
import { Equipment } from '@/types';
import { EquipmentForm } from '@/components/equipments/EquipmentForm';
import { Card } from '@/components/ui/Card';

export default function EditEquipmentPage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin, loading: authLoading, user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Wait for auth to load, then check if admin
    if (!authLoading && (!user || !isAdmin())) {
      router.push('/equipments');
    }
  }, [authLoading, user, isAdmin, router]);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!params.id || authLoading) return;
      
      try {
        const data = await equipmentAPI.getById(params.id as string);
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        router.push('/equipments');
      } finally {
        setLoading(false);
      }
    };

    if (params.id && !authLoading && user && isAdmin()) {
      fetchEquipment();
    }
  }, [params.id, router, authLoading, user, isAdmin]);

  // Show loading while checking auth or fetching equipment
  if (authLoading || loading) {
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

  if (!equipment) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-red-600">Equipment not found</div>
      </div>
    );
  }

  const handleSubmit = async (data: Partial<Equipment>) => {
    try {
      setSaving(true);
      // For editing: if quantity_total changed, calculate new available
      // Available = current available + (new total - old total)
      if (equipment && data.quantity_total !== undefined) {
        const totalDiff = data.quantity_total - equipment.quantity_total;
        data.quantity_available = (data.quantity_available || equipment.quantity_available) + totalDiff;
      }
      await equipmentAPI.update(equipment.id, data);
      router.push('/equipments');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update equipment');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Equipment</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update equipment information
        </p>
      </div>

      <Card>
        <EquipmentForm
          equipment={equipment}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/equipments')}
          loading={saving}
        />
      </Card>
    </div>
  );
}

