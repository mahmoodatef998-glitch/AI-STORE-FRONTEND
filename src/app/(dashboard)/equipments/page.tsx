'use client';

import { useState, useEffect } from 'react';
import { useEquipments } from '@/hooks/useEquipments';
import { useAuth } from '@/hooks/useAuth';
import { equipmentAPI } from '@/lib/api';
import { EquipmentTable } from '@/components/equipments/EquipmentTable';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Equipment } from '@/types';

export default function EquipmentsPage() {
  const { equipments, loading, error, refetch } = useEquipments();
  const { isAdmin, loading: authLoading } = useAuth();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [localEquipments, setLocalEquipments] = useState<Equipment[]>([]);

  // Sync local state with hook state
  useEffect(() => {
    if (equipments.length > 0) {
      setLocalEquipments(equipments);
    }
  }, [equipments]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
      setDeleting(id);
      console.log('🗑️ Deleting equipment:', id);
      
      await equipmentAPI.delete(id);
      
      // Optimistically update local state
      setLocalEquipments(prev => prev.filter(eq => eq.id !== id));
      
      // Refetch to ensure consistency
      await refetch();
      
      console.log('✅ Equipment deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting equipment:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete equipment');
      // Refetch to restore correct state
      await refetch();
    } finally {
      setDeleting(null);
    }
  };

  const handleRetry = async () => {
    console.log('🔄 Manual retry triggered');
    await refetch();
  };

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading equipments...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
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

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Error loading equipments
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleRetry}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (localEquipments.length === 0 && !loading) {
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

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No equipments</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new equipment.
          </p>
          {isAdmin() && (
            <div className="mt-6">
              <Link href="/equipments/new">
                <Button>Add Equipment</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show equipments table
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipments</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your equipment inventory ({localEquipments.length} items)
          </p>
        </div>
        {isAdmin() && (
          <Link href="/equipments/new">
            <Button>Add Equipment</Button>
          </Link>
        )}
      </div>

      <EquipmentTable
        equipments={localEquipments}
        onDelete={isAdmin() ? handleDelete : undefined}
        deleting={deleting}
      />
    </div>
  );
}
