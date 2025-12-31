import { EquipmentConsumption } from '@/types';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { formatDate } from '@/lib/utils';

interface ConsumptionHistoryProps {
  consumption: EquipmentConsumption[];
  loading?: boolean;
}

export function ConsumptionHistory({ consumption, loading }: ConsumptionHistoryProps) {
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading history...</div>;
  }

  if (consumption.length === 0) {
    return <p className="text-gray-500 text-sm">No consumption records found</p>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Date</TableHeader>
          <TableHeader>Equipment ID</TableHeader>
          <TableHeader>Quantity Used</TableHeader>
          <TableHeader>Purpose</TableHeader>
          <TableHeader>User ID</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {consumption.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{formatDate(record.date)}</TableCell>
            <TableCell className="font-mono text-xs">{record.equipment_id.slice(0, 8)}...</TableCell>
            <TableCell>{record.quantity_used}</TableCell>
            <TableCell>{record.purpose || 'N/A'}</TableCell>
            <TableCell className="font-mono text-xs">{record.user_id.slice(0, 8)}...</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

