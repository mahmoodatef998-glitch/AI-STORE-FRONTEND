import { Equipment } from '@/types';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface LowStockAlertsProps {
  equipments: Equipment[];
}

export function LowStockAlerts({ equipments }: LowStockAlertsProps) {
  if (equipments.length === 0) {
    return (
      <Card title="Low Stock Alerts">
        <p className="text-gray-500 text-sm">No low stock items</p>
      </Card>
    );
  }

  return (
    <Card title="Low Stock Alerts">
      <div className="space-y-3">
        {equipments.map((equipment) => (
          <div
            key={equipment.id}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{equipment.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Available: {equipment.quantity_available} / Threshold: {equipment.minimum_threshold}
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded">
                Low Stock
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link
          href="/equipments"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all equipments →
        </Link>
      </div>
    </Card>
  );
}

