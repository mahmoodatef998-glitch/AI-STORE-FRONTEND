import { Notification } from '@/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  onMarkAsSent?: (id: string) => void;
}

export function NotificationList({ notifications, loading, onMarkAsSent }: NotificationListProps) {
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return <p className="text-gray-500 text-sm">No notifications found</p>;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 border-blue-200';
      case 'dashboard':
        return 'bg-yellow-100 border-yellow-200';
      case 'whatsapp':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 border rounded-lg ${getTypeColor(notification.type)} ${
            notification.sent ? 'opacity-60' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 text-xs font-semibold bg-white rounded">
                  {notification.type}
                </span>
                {notification.sent && (
                  <span className="px-2 py-1 text-xs font-semibold bg-gray-200 rounded">
                    Read
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDate(notification.timestamp)}
              </p>
            </div>
            {!notification.sent && onMarkAsSent && (
              <Button
                variant="outline"
                className="ml-4 text-xs"
                onClick={() => onMarkAsSent(notification.id)}
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


