'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Equipment, CreateOrderDto } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MaterialsTable } from './MaterialsTable';
import { ReceiptUpload } from './ReceiptUpload';

interface OrderFormProps {
  equipments: Equipment[];
  onSubmit: (data: CreateOrderDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<CreateOrderDto>;
}

interface MaterialRow {
  id: string;
  equipment_id: string;
  quantity: number;
}

export function OrderForm({ equipments, onSubmit, onCancel, loading, initialData }: OrderFormProps) {
  const [formData, setFormData] = useState(() => ({
    generator_model: initialData?.generator_model || 'Perkins',
    order_reference: initialData?.order_reference || '',
    receiver_name: initialData?.receiver_name || '',
    notes: initialData?.notes || '',
  }));

  const [materials, setMaterials] = useState<MaterialRow[]>(() => {
    if (initialData?.materials && initialData.materials.length > 0) {
      return initialData.materials.map((m, index) => ({
        id: `material-${index}-${m.equipment_id}-${Date.now()}`,
        equipment_id: m.equipment_id,
        quantity: m.quantity,
      }));
    }
    return [];
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        generator_model: initialData.generator_model || 'Perkins',
        order_reference: initialData.order_reference || '',
        receiver_name: initialData.receiver_name || '',
        notes: initialData.notes || '',
      });

      if (initialData.materials && initialData.materials.length > 0) {
        setMaterials(
          initialData.materials.map((m, index) => ({
            id: `material-${index}-${m.equipment_id}-${Date.now()}`,
            equipment_id: m.equipment_id,
            quantity: m.quantity,
          }))
        );
      }
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.order_reference.trim()) {
      newErrors.order_reference = 'Order reference is required';
    }

    if (!formData.receiver_name.trim()) {
      newErrors.receiver_name = 'Receiver name is required';
    }

    if (materials.length === 0) {
      newErrors.materials = 'At least one material is required';
    }

    // Validate each material
    materials.forEach((material, index) => {
      if (!material.equipment_id) {
        newErrors[`material_${index}_equipment`] = 'Please select a material';
      }

      if (material.quantity <= 0) {
        newErrors[`material_${index}_quantity`] = 'Quantity must be greater than zero';
      }

      const equipment = equipments.find((e) => e.id === material.equipment_id);
      if (equipment && material.quantity > equipment.quantity_available) {
        newErrors[`material_${index}_quantity`] = `Available stock: ${equipment.quantity_available}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const orderData: CreateOrderDto = {
        generator_model: formData.generator_model,
        order_reference: formData.order_reference,
        receiver_name: formData.receiver_name,
        notes: formData.notes || undefined,
        materials: materials.map((m) => ({
          equipment_id: m.equipment_id,
          quantity: m.quantity,
        })),
      };

      await onSubmit(orderData);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Generator Model *
          </label>
          <select
            value={formData.generator_model}
            onChange={(e) => setFormData({ ...formData, generator_model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Perkins">Perkins</option>
            <option value="Cummins">Cummins</option>
            <option value="Caterpillar">Caterpillar</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Order Reference / Job Number *"
          value={formData.order_reference}
          onChange={(e) => setFormData({ ...formData, order_reference: e.target.value })}
          error={errors.order_reference}
          required
          placeholder="e.g., ORD-2024-001"
        />

        <Input
          label="Receiver Name *"
          value={formData.receiver_name}
          onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
          error={errors.receiver_name}
          required
          placeholder="Name of person who received materials"
        />

        <Input
          label="Order Date"
          type="date"
          value={new Date().toISOString().split('T')[0]}
          disabled
        />
      </div>

      <div>
        <Input
          label="Notes (Optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes..."
        />
      </div>

      <MaterialsTable
        equipments={equipments}
        materials={materials}
        onMaterialsChange={setMaterials}
      />

      {errors.materials && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.materials}
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Files (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload receipt files signed by the receiver. Supported formats: JPEG, PNG, PDF (Max 10MB)
        </p>
        <ReceiptUpload
          orderId={initialData ? 'existing' : undefined}
          onFilesChange={(files) => {
            // Store files for later upload after order creation
            (window as any).__pendingReceiptFiles = files;
          }}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || materials.length === 0}>
          {loading ? 'Processing...' : 'Confirm Order'}
        </Button>
      </div>
    </form>
  );
}

