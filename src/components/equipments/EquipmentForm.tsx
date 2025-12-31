'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Equipment, EquipmentType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { equipmentAPI } from '@/lib/api';

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (data: Partial<Equipment>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function EquipmentForm({ equipment, onSubmit, onCancel, loading }: EquipmentFormProps) {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    type: (equipment?.type || 'electrical') as EquipmentType,
    quantity_total: equipment?.quantity_total || 0,
    quantity_available: equipment?.quantity_available || 0,
    minimum_threshold: equipment?.minimum_threshold || 10,
    unit_price: equipment?.unit_price || 0,
    location: equipment?.location || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingEquipments, setExistingEquipments] = useState<Equipment[]>([]);
  const [, setIsLoadingEquipments] = useState(false);

  // Load existing equipments for autocomplete (only when creating new, not editing)
  useEffect(() => {
    if (!equipment) {
      const loadEquipments = async () => {
        try {
          setIsLoadingEquipments(true);
          const equipments = await equipmentAPI.getAll();
          setExistingEquipments(equipments);
        } catch (error) {
          console.error('Error loading equipments:', error);
        } finally {
          setIsLoadingEquipments(false);
        }
      };
      loadEquipments();
    }
  }, [equipment]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required';
    } else {
      // Check for duplicate names (case-insensitive, trim whitespace)
      const normalizedName = formData.name.trim().toLowerCase();
      const duplicate = existingEquipments.find(
        (eq) => eq.name.trim().toLowerCase() === normalizedName && eq.id !== equipment?.id
      );
      
      if (duplicate) {
        newErrors.name = `Equipment "${duplicate.name}" already exists. Please select it from the list or use a different name.`;
      }
    }

    if (formData.quantity_total < 0) {
      newErrors.quantity_total = 'New quantity must be greater than or equal to zero';
    }

    if (formData.quantity_available < 0) {
      newErrors.quantity_available = 'Current stock must be greater than or equal to zero';
    }

    // Note: Available can be less than total (new quantity to add)
    // Total will be calculated as: available + new quantity

    if (formData.minimum_threshold < 0) {
      newErrors.minimum_threshold = 'Minimum threshold must be greater than or equal to zero';
    }

    if (formData.unit_price < 0) {
      newErrors.unit_price = 'Unit price must be greater than or equal to zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Prepare autocomplete options from existing equipments
  const autocompleteOptions = existingEquipments.map((eq) => ({
    value: eq.id,
    label: eq.name,
    equipment: eq,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {equipment ? (
          // When editing, use regular input (read-only or editable)
          <Input
            label="Equipment Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            placeholder="e.g., 5kW Electric Generator"
          />
        ) : (
          // When creating new, use autocomplete
          <Autocomplete
            label="Equipment Name *"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            onSelect={(option) => {
              // If selecting existing equipment, populate form with its data
              if (option.equipment) {
                setFormData({
                  ...formData,
                  name: option.equipment.name,
                  type: option.equipment.type,
                  quantity_available: option.equipment.quantity_available,
                  minimum_threshold: option.equipment.minimum_threshold,
                  unit_price: option.equipment.unit_price || 0,
                  location: option.equipment.location || '',
                });
              }
            }}
            options={autocompleteOptions}
            error={errors.name}
            required
            placeholder="Type to search or enter new equipment name..."
            helperText="Search existing equipment or type a new name to create"
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as EquipmentType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="electrical">Electrical</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <Input
          label="New Quantity to Add *"
          type="number"
          min="0"
          value={formData.quantity_total}
          onChange={(e) => {
            const newQty = parseInt(e.target.value) || 0;
            setFormData({ 
              ...formData, 
              quantity_total: newQty,
              // Keep available quantity as current stock, don't auto-update
            });
          }}
          error={errors.quantity_total}
          required
          placeholder="0"
          helperText="Quantity you are adding to the store now"
        />

        <Input
          label="Current Available Stock *"
          type="number"
          min="0"
          value={formData.quantity_available}
          onChange={(e) => setFormData({ ...formData, quantity_available: parseInt(e.target.value) || 0 })}
          error={errors.quantity_available}
          required
          placeholder="0"
          helperText="Current quantity physically available in store"
        />

        <Input
          label="Minimum Threshold *"
          type="number"
          min="0"
          value={formData.minimum_threshold}
          onChange={(e) => setFormData({ ...formData, minimum_threshold: parseInt(e.target.value) || 0 })}
          error={errors.minimum_threshold}
          required
          placeholder="10"
        />

        <Input
          label="Unit Price"
          type="number"
          step="0.01"
          min="0"
          value={formData.unit_price}
          onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
          error={errors.unit_price}
          placeholder="0.00"
        />

        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Warehouse A"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : equipment ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

