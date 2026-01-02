import { useState, useEffect, useCallback } from 'react';
import { equipmentAPI } from '@/lib/api';
import { Equipment } from '@/types';

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchEquipments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching equipments...');
      const data = await equipmentAPI.getAll();
      
      console.log('✅ Equipments fetched successfully:', data.length);
      setEquipments(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch equipments';
      console.error('❌ Error fetching equipments:', err);
      setError(errorMessage);
      
      // Auto-retry on network errors (max 2 retries)
      if (retryCount < 2 && (errorMessage.includes('Network') || errorMessage.includes('fetch'))) {
        console.log(`🔄 Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  return {
    equipments,
    loading,
    error,
    refetch: fetchEquipments,
  };
}
