import { useEffect, useState } from 'react';
import { PackageOpen, CheckCircle, AlertTriangle, XCircle, ArrowRight, Clock } from 'lucide-react';
import { getStats, getNotifications } from '../../services/productService';
import { getExpiresInText } from '../../utils/dateUtils';
import StatusBadge from '../common/StatusBadge';
import { Card, CardBody, CardHeader } from '../ui/Card';
import StatTile from '../ui/StatTile';
import Button from '../ui/Button';

function UserDashboardTab({ onNavigate }) {
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, nearExpiry: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getStats();
        setStats(statsData || { total: 0, active: 0, expired: 0, nearExpiry: 0 });

        const notifData = await getNotifications();
        const items = [...(notifData.nearExpiry || []), ...(notifData.expired || [])];
        setUpcoming(items.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)).slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <div className="skeleton h-3 w-20 rounded mb-2" />
              <div className="skeleton h-6 w-12 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: PackageOpen, tone: 'brand' },
    { label: 'Active Warranties', value: stats.active, icon: CheckCircle, tone: 'good' },
    { label: 'Expiring Soon', value: stats.nearExpiry, icon: AlertTriangle, tone: 'warn' },
    { label: 'Expired', value: stats.expired, icon: XCircle, tone: 'bad' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <StatTile key={c.label} label={c.label} value={c.value} icon={c.icon} tone={c.tone} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Action required"
              subtitle="Items expiring soon or already expired."
              action={
                <Button variant="ghost" size="sm" type="button" onClick={() => onNavigate('products')}>
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
            <CardBody className="p-0">
              <div className="divide-y divide-slate-100">
                {upcoming.length ? (
                  upcoming.map((item) => (
                    <div
                      key={item._id}
                      className={`group flex items-center justify-between gap-4 px-6 py-4 transition-all duration-200 hover:bg-gray-50/80 ${
                        item.status === 'Expired'
                          ? 'bg-red-50/30'
                          : item.status === 'Near Expiry'
                          ? 'bg-amber-50/30'
                          : 'bg-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.productName}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          {getExpiresInText(item.expiryDate)}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
                    <p className="text-base font-semibold text-gray-900 mb-4">
                      {stats.total > 0 ? "No actions required right now 🎉" : "No products added yet 😕"}
                    </p>
                    <Button type="button" onClick={() => onNavigate('products')}>
                      + Add Product
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader title="Quick actions" subtitle="Common tasks." />
          <CardBody className="space-y-2">
            <Button variant="secondary" className="w-full" type="button" onClick={() => onNavigate('products')}>
              Add / manage products
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={() => onNavigate('maintenance')}>
              Log maintenance
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={() => onNavigate('notifications')}>
              View notifications
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default UserDashboardTab;
