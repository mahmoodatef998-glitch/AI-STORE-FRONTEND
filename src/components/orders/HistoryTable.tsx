import { StockMovement, Equipment } from '@/types';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { formatDate } from '@/lib/utils';

interface HistoryTableProps {
  movements: StockMovement[];
  equipments: Equipment[];
  loading?: boolean;
}

export function HistoryTable({ movements, equipments, loading }: HistoryTableProps) {
  const getEquipmentName = (equipmentId: string): string => {
    const equipment = equipments.find((e) => e.id === equipmentId);
    return equipment?.name || equipmentId.slice(0, 8) + '...';
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (movements.length === 0) {
    return <p className="text-gray-500 text-sm text-center py-8">No movements found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Date & Time</TableHeader>
            <TableHeader>Material Name</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Movement Type</TableHeader>
            <TableHeader>Receiver Name</TableHeader>
            <TableHeader>Order Reference</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{formatDate(movement.created_at)}</TableCell>
              <TableCell className="font-medium">
                {getEquipmentName(movement.equipment_id)}
              </TableCell>
              <TableCell>
                <span className="font-semibold text-red-600">-{movement.quantity}</span>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                  {movement.type === 'OUT' ? 'OUT' : 'IN'}
                </span>
              </TableCell>
              <TableCell>{movement.receiver_name || '-'}</TableCell>
              <TableCell>
                {movement.related_order_id ? (
                  <span className="font-mono text-xs text-primary-600">
                    {movement.related_order_id.slice(0, 8)}...
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

