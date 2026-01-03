import { useState, useEffect, useCallback, useRef } from 'react';
import { equipmentAPI } from '@/lib/api';
import { Equipment } from '@/types';

const MAX_RETRIES = 2;

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);

  const fetchEquipments = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching equipments...');
      const data = await equipmentAPI.getAll();
      
      if (!isMountedRef.current) return;
      
      console.log('✅ Equipments fetched successfully:', data.length);
      setEquipments(data);
      retryCountRef.current = 0; // Reset retry count on success
    } catch (err) {
      if (!isMountedRef.current) return;
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch equipments';
      console.error('❌ Error fetching equipments:', err);
      setError(errorMessage);
      
      // Auto-retry on network errors (max 2 retries)
      if (retryCountRef.current < MAX_RETRIES && (errorMessage.includes('Network') || errorMessage.includes('fetch'))) {
        retryCountRef.current += 1;
        console.log(`🔄 Retrying... (${retryCountRef.current}/${MAX_RETRIES})`);
        setTimeout(() => {
          if (isMountedRef.current) {
            fetchEquipments();
          }
        }, 2000);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []); // Empty dependencies - function is stable

  useEffect(() => {
    isMountedRef.current = true;
    fetchEquipments();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchEquipments]);

  return {
    equipments,
    loading,
    error,
    refetch: fetchEquipments,
  };
}
