'use client';

import { useState } from 'react';
import { useEquipments } from '@/hooks/useEquipments';
import { useAuth } from '@/hooks/useAuth';
import { equipmentAPI } from '@/lib/api';
import { EquipmentTable } from '@/components/equipments/EquipmentTable';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function EquipmentsPage() {
  const { equipments, loading, error, refetch } = useEquipments();
  const { isAdmin } = useAuth();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
      setDeleting(id);
      await equipmentAPI.delete(id);
      refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete equipment');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading equipments...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipments</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your equipment inventory
          </p>
        </div>
        {isAdmin() && (
          <Link href="/equipments/new">
            <Button>Add Equipment</Button>
          </Link>
        )}
      </div>

      <EquipmentTable
        equipments={equipments}
        onDelete={isAdmin() ? handleDelete : undefined}
        deleting={deleting}
      />
    </div>
  );
}

