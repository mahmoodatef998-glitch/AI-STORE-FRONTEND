import { Equipment } from '@/types';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface EquipmentTableProps {
  equipments: Equipment[];
  onDelete?: (id: string) => void;
  deleting?: string | null;
}

export function EquipmentTable({ equipments, onDelete, deleting }: EquipmentTableProps) {
  const getTypeBadge = (type: string) => {
    const colors = type === 'electrical' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${colors}`}>
        {type}
      </span>
    );
  };

  const getStockStatus = (available: number, threshold: number) => {
    if (available <= threshold) {
      return <span className="text-red-600 font-semibold">Low Stock</span>;
    }
    return <span className="text-green-600">In Stock</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Available</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Threshold</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Location</TableHeader>
            <TableHeader>Status</TableHeader>
            {onDelete && <TableHeader>Actions</TableHeader>}
          </TableRow>
        </TableHead>
        <TableBody>
          {equipments.length === 0 ? (
            <TableRow>
              <td colSpan={onDelete ? 9 : 8} className="text-center py-8 text-gray-500">
                No equipments found
              </td>
            </TableRow>
          ) : (
            equipments.map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/equipments/${equipment.id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {equipment.name}
                  </Link>
                </TableCell>
                <TableCell>{getTypeBadge(equipment.type)}</TableCell>
                <TableCell>{equipment.quantity_available}</TableCell>
                <TableCell>{equipment.quantity_total}</TableCell>
                <TableCell>{equipment.minimum_threshold}</TableCell>
                <TableCell>{formatCurrency(equipment.unit_price)}</TableCell>
                <TableCell>{equipment.location || 'N/A'}</TableCell>
                <TableCell>
                  {getStockStatus(equipment.quantity_available, equipment.minimum_threshold)}
                </TableCell>
                {onDelete && (
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/equipments/${equipment.id}`}>
                        <Button variant="outline" className="text-xs px-2 py-1">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="text-xs px-2 py-1"
                        onClick={() => onDelete(equipment.id)}
                        disabled={deleting === equipment.id}
                      >
                        {deleting === equipment.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

