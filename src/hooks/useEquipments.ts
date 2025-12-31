import { useState, useEffect } from 'react';
import { equipmentAPI } from '@/lib/api';
import { Equipment } from '@/types';

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentAPI.getAll();
      setEquipments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch equipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return {
    equipments,
    loading,
    error,
    refetch: fetchEquipments,
  };
}

