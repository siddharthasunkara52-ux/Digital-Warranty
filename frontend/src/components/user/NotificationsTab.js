import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, XCircle, Wrench, Clock } from 'lucide-react';
import Spinner from '../Spinner';
import EmptyState from '../common/EmptyState';
import { getNotifications } from '../../services/productService';
import { getUpcoming } from '../../services/maintenanceService';
import { getExpiresInText, formatDate } from '../../utils/dateUtils';

function NotificationsTab() {
  const [notifications, setNotifications] = useState({ nearExpiry: [], expired: [], maintenance: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifData = await getNotifications();
        const maintData = await getUpcoming();
        setNotifications({
          nearExpiry: notifData.nearExpiry || [],
          expired: notifData.expired || [],
          maintenance: maintData || []
        });
      } catch (err) {
        console.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner text="Loading notifications..." />;

  const totalAlerts = notifications.nearExpiry.length + notifications.expired.length + notifications.maintenance.length;

  return (
    <div className="space-y-4">
      {}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-0.5">Notifications</h3>
        <p className="text-sm text-gray-500">
          {totalAlerts > 0
            ? `You have ${totalAlerts} alert${totalAlerts > 1 ? 's' : ''} requiring attention.`
            : "You're all caught up — no pending alerts."}
        </p>
      </div>

      {totalAlerts === 0 && (
        <EmptyState
          icon={Bell}
          title="All clear"
          description="No pending alerts, expirations, or maintenance reminders."
        />
      )}

      {}
      <div className="space-y-2">
        {notifications.expired.map(item => (
          <div key={`exp-${item._id}`} className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-4">
            <div className="rounded-md bg-red-100 p-1.5 text-red-600 flex-shrink-0">
              <XCircle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-900">Warranty Expired</p>
              <p className="text-sm text-red-700 mt-0.5">
                <strong>{item.productName}</strong> — {getExpiresInText(item.expiryDate)}
              </p>
            </div>
            <span className="text-xs text-red-400 flex items-center gap-1 whitespace-nowrap flex-shrink-0">
              <Clock className="h-3 w-3" />
              {formatDate(item.expiryDate)}
            </span>
          </div>
        ))}

        {notifications.nearExpiry.map(item => (
          <div key={`near-${item._id}`} className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4">
            <div className="rounded-md bg-amber-100 p-1.5 text-amber-600 flex-shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-900">Expiring Soon</p>
              <p className="text-sm text-amber-700 mt-0.5">
                <strong>{item.productName}</strong> — {getExpiresInText(item.expiryDate)}
              </p>
            </div>
            <span className="text-xs text-amber-400 flex items-center gap-1 whitespace-nowrap flex-shrink-0">
              <Clock className="h-3 w-3" />
              {formatDate(item.expiryDate)}
            </span>
          </div>
        ))}

        {notifications.maintenance.map(item => (
          <div key={`maint-${item._id}`} className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="rounded-md bg-blue-100 p-1.5 text-blue-600 flex-shrink-0">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900">Upcoming Maintenance</p>
              <p className="text-sm text-blue-700 mt-0.5">{formatDate(item.serviceDate)} — {item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsTab;
