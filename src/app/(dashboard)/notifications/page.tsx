'use client';

import { useEffect, useState } from 'react';
import { notificationAPI } from '@/lib/api';
import { Notification } from '@/types';
import { NotificationList } from '@/components/notifications/NotificationList';
import { Card } from '@/components/ui/Card';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationAPI.getAll(undefined, filter === 'unread' ? false : undefined);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [filter]);

  const handleMarkAsSent = async (id: string) => {
    try {
      await notificationAPI.markAsSent(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, sent: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as sent:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-600">
            View alerts and AI predictions
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unread'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      <Card>
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAsSent={handleMarkAsSent}
        />
      </Card>
    </div>
  );
}


