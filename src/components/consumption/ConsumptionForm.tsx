'use client';

import { useState, FormEvent } from 'react';
import { Equipment } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ConsumptionFormProps {
  equipments: Equipment[];
  onSubmit: (data: {
    equipment_id: string;
    quantity_used: number;
    purpose?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function ConsumptionForm({ equipments, onSubmit, onCancel }: ConsumptionFormProps) {
  const [formData, setFormData] = useState({
    equipment_id: '',
    quantity_used: 1,
    purpose: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const selectedEquipment = equipments.find((eq) => eq.id === formData.equipment_id);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.equipment_id) {
      newErrors.equipment_id = 'Please select an equipment';
    }

    if (formData.quantity_used <= 0) {
      newErrors.quantity_used = 'Quantity must be greater than 0';
    }

    if (selectedEquipment && formData.quantity_used > selectedEquipment.quantity_available) {
      newErrors.quantity_used = `Only ${selectedEquipment.quantity_available} units available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Equipment *
        </label>
        <select
          value={formData.equipment_id}
          onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.equipment_id ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select equipment</option>
          {equipments.map((equipment) => (
            <option key={equipment.id} value={equipment.id}>
              {equipment.name} (Available: {equipment.quantity_available})
            </option>
          ))}
        </select>
        {errors.equipment_id && (
          <p className="mt-1 text-sm text-red-600">{errors.equipment_id}</p>
        )}
      </div>

      <Input
        label="Quantity Used *"
        type="number"
        min="1"
        value={formData.quantity_used}
        onChange={(e) => setFormData({ ...formData, quantity_used: parseInt(e.target.value) || 1 })}
        error={errors.quantity_used}
        required
      />

      <Input
        label="Purpose"
        value={formData.purpose}
        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
        placeholder="e.g., Maintenance, Project X, etc."
      />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging...' : 'Log Consumption'}
        </Button>
      </div>
    </form>
  );
}


