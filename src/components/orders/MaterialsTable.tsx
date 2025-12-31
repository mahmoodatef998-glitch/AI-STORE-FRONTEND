'use client';

import { Equipment } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';

interface MaterialRow {
  id: string;
  equipment_id: string;
  quantity: number;
}

interface MaterialsTableProps {
  equipments: Equipment[];
  materials: MaterialRow[];
  onMaterialsChange: (materials: MaterialRow[]) => void;
}

export function MaterialsTable({ equipments, materials, onMaterialsChange }: MaterialsTableProps) {
  const addMaterial = () => {
    const newMaterial: MaterialRow = {
      id: Date.now().toString(),
      equipment_id: '',
      quantity: 1,
    };
    onMaterialsChange([...materials, newMaterial]);
  };

  const removeMaterial = (id: string) => {
    onMaterialsChange(materials.filter((m) => m.id !== id));
  };

  const updateMaterial = (id: string, field: keyof MaterialRow, value: string | number) => {
    onMaterialsChange(
      materials.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const getEquipment = (equipmentId: string) => {
    return equipments.find((e) => e.id === equipmentId);
  };

  // Prepare autocomplete options from equipments
  const autocompleteOptions = equipments.map((eq) => ({
    value: eq.id,
    label: `${eq.name} (Stock: ${eq.quantity_available})`,
    equipment: eq,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Required Materials</h3>
        <Button type="button" onClick={addMaterial} variant="outline">
          ➕ Add Material
        </Button>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
          <p>No materials added</p>
          <p className="text-sm mt-2">Click &quot;Add Material&quot; to start adding materials</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Material Name</TableHeader>
                <TableHeader>Available Stock</TableHeader>
                <TableHeader>Quantity Required</TableHeader>
                <TableHeader>Unit</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((material) => {
                const equipment = getEquipment(material.equipment_id);
                const available = equipment?.quantity_available || 0;
                const hasError = material.equipment_id && material.quantity > available;

                return (
                  <TableRow key={material.id}>
                    <TableCell>
                      <Autocomplete
                        value={equipment?.name || ''}
                        onChange={(value) => {
                          // Find equipment by name
                          const found = equipments.find(eq => eq.name === value);
                          if (found) {
                            updateMaterial(material.id, 'equipment_id', found.id);
                          } else {
                            // Clear selection if name doesn't match
                            updateMaterial(material.id, 'equipment_id', '');
                          }
                        }}
                        onSelect={(option) => {
                          if (option.equipment) {
                            updateMaterial(material.id, 'equipment_id', option.equipment.id);
                          }
                        }}
                        options={autocompleteOptions}
                        placeholder="Type to search material..."
                        helperText="Search and select material from list"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <span className={hasError ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                        {equipment ? available : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(material.id, 'quantity', parseInt(e.target.value) || 1)}
                        className={hasError ? 'border-red-500' : ''}
                        required
                      />
                      {hasError && (
                        <p className="text-xs text-red-600 mt-1">
                          Available stock: {available}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">
                        {equipment ? 'pcs' : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeMaterial(material.id)}
                        className="text-xs px-2 py-1"
                      >
                        ❌ Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

