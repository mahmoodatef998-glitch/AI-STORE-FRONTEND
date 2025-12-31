'use client';

import { useState, useEffect } from 'react';
import { useConsumption } from '@/hooks/useConsumption';
import { useEquipments } from '@/hooks/useEquipments';
import { consumptionAPI } from '@/lib/api';
import { ConsumptionForm } from '@/components/consumption/ConsumptionForm';
import { ConsumptionHistory } from '@/components/consumption/ConsumptionHistory';
import { Card } from '@/components/ui/Card';

export default function ConsumptionPage() {
  const { equipments } = useEquipments();
  const { consumption, loading, refetch } = useConsumption();
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: {
    equipment_id: string;
    quantity_used: number;
    purpose?: string;
  }) => {
    try {
      await consumptionAPI.log(data);
      refetch();
      setShowForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to log consumption');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consumption</h1>
          <p className="mt-2 text-sm text-gray-600">
            Log equipment consumption and view history
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : 'Log Consumption'}
        </button>
      </div>

      {showForm && (
        <Card title="Log Consumption">
          <ConsumptionForm
            equipments={equipments}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      <Card title="Consumption History">
        <ConsumptionHistory consumption={consumption} loading={loading} />
      </Card>
    </div>
  );
}

