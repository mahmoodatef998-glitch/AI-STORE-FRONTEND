import { useState, useEffect } from 'react';
import { consumptionAPI } from '@/lib/api';
import { EquipmentConsumption, ConsumptionFilter } from '@/types';

export function useConsumption(filter?: ConsumptionFilter) {
  const [consumption, setConsumption] = useState<EquipmentConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsumption = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consumptionAPI.getHistory(filter);
      setConsumption(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch consumption');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumption();
  }, [JSON.stringify(filter)]);

  return {
    consumption,
    loading,
    error,
    refetch: fetchConsumption,
  };
}

