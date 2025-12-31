'use client';

import { useState, useEffect } from 'react';
import { orderAPI, equipmentAPI } from '@/lib/api';
import { StockMovement, Equipment } from '@/types';
import { HistoryTable } from '@/components/orders/HistoryTable';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function HistoryPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    equipment_id: '',
    receiver_name: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movementsData, equipmentsData] = await Promise.all([
          orderAPI.getStockMovements({
            equipment_id: filters.equipment_id || undefined,
            receiver_name: filters.receiver_name || undefined,
            start_date: filters.start_date || undefined,
            end_date: filters.end_date || undefined,
            type: 'OUT',
          }),
          equipmentAPI.getAll(),
        ]);
        setMovements(movementsData);
        setEquipments(equipmentsData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    setFilters({
      equipment_id: '',
      receiver_name: '',
      start_date: '',
      end_date: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Movements History</h1>
        <p className="mt-2 text-sm text-gray-600">
          View history of stock movements and orders
        </p>
      </div>

      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material
            </label>
            <select
              value={filters.equipment_id}
              onChange={(e) => handleFilterChange('equipment_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Materials</option>
              {equipments.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Receiver Name"
            value={filters.receiver_name}
            onChange={(e) => handleFilterChange('receiver_name', e.target.value)}
            placeholder="Search by name..."
          />

          <Input
            label="From Date"
            type="date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
          />

          <Input
            label="To Date"
            type="date"
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </Card>

      <Card>
        <HistoryTable movements={movements} equipments={equipments} loading={loading} />
      </Card>
    </div>
  );
}

