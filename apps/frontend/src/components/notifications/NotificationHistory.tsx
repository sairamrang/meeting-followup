import { useEffect, useState } from 'react';
import {
  BellIcon,
  EyeIcon,
  ArrowPathIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { notificationsApi } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Notification, DeviceType, NotificationType } from '@meeting-followup/shared';

interface NotificationHistoryProps {
  followupId: string;
}

export function NotificationHistory({ followupId }: NotificationHistoryProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [followupId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationsApi.getByFollowup(followupId);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notification history');
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType?: DeviceType | null) => {
    switch (deviceType) {
      case 'MOBILE':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'TABLET':
        return <DeviceTabletIcon className="h-4 w-4" />;
      case 'DESKTOP':
      default:
        return <ComputerDesktopIcon className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    return type === 'FIRST_VIEW' ? (
      <EyeIcon className="h-5 w-5 text-blue-600" />
    ) : (
      <ArrowPathIcon className="h-5 w-5 text-purple-600" />
    );
  };

  const getTypeBadge = (type: NotificationType) => {
    const isFirstView = type === 'FIRST_VIEW';
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          isFirstView
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
        }`}
      >
        {isFirstView ? 'First View' : 'Revisit'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <BellIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">View Alerts</h2>
        </div>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <BellIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">View Alerts</h2>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Count stats
  const firstViews = notifications.filter((n) => n.type === 'FIRST_VIEW').length;
  const revisits = notifications.filter((n) => n.type === 'REVISIT').length;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BellIcon className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">View Alerts</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {firstViews} first view{firstViews !== 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {revisits} revisit{revisits !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">No alerts yet</p>
            <p className="mt-1 text-sm text-gray-500">
              You'll see notifications here when someone views this follow-up
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const sentAt = new Date(notification.sentAt);
              const isValidDate = !isNaN(sentAt.getTime());

              return (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeBadge(notification.type)}
                      <span className="text-xs text-gray-500">
                        {isValidDate
                          ? sentAt.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })
                          : 'Unknown date'}
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-gray-600">
                      {notification.viewerDeviceType && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded border border-gray-200">
                          {getDeviceIcon(notification.viewerDeviceType)}
                          <span>{notification.viewerDeviceType}</span>
                        </span>
                      )}
                      {notification.viewerBrowser && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-white rounded border border-gray-200">
                          {notification.viewerBrowser}
                        </span>
                      )}
                      {notification.viewerLocationCity && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded border border-gray-200">
                          <MapPinIcon className="h-3 w-3" />
                          {notification.viewerLocationCity}
                          {notification.viewerLocationCountry &&
                            `, ${notification.viewerLocationCountry}`}
                        </span>
                      )}
                    </div>
                  </div>
                  {notification.delivered && (
                    <span className="flex-shrink-0 text-xs text-green-600">Sent</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
