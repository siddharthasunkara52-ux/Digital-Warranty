import { useEffect, useState } from 'react';
import { Users, Database, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import Spinner from '../Spinner';
import { getAllAdminProducts } from '../../services/adminService';
import StatTile from '../ui/StatTile';
import { Card, CardBody, CardHeader } from '../ui/Card';

function AdminDashboardTab() {
  const [adminData, setAdminData] = useState({ users: [], products: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAdminProducts();
        setAdminData(data || { users: [], products: [], stats: {} });
      } catch (err) {
        console.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner text="Loading admin dashboard..." />;

  const totalUsers = adminData.users?.length || 0;
  const totalProducts = adminData.products?.length || 0;
  const expired = adminData.products?.filter(p => p.status === 'Expired').length || 0;
  const active = adminData.products?.filter(p => p.status === 'Active').length || 0;
  const nearExpiry = adminData.products?.filter(p => p.status === 'Near Expiry').length || 0;

  const maxVal = Math.max(totalUsers, totalProducts, expired, active, nearExpiry, 1);
  const chartData = [
    { label: 'Users', value: totalUsers, color: '#3b82f6' },
    { label: 'Products', value: totalProducts, color: '#6366f1' },
    { label: 'Expired', value: expired, color: '#ef4444' },
    { label: 'Active', value: active, color: '#22c55e' },
    { label: 'Near Expiry', value: nearExpiry, color: '#f59e0b' },
  ];

  const total = active + expired + nearExpiry || 1;
  const activePercent = (active / total) * 100;
  const expiredPercent = (expired / total) * 100;
  const nearExpiryPercent = (nearExpiry / total) * 100;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const activeStroke = (activePercent / 100) * circumference;
  const expiredStroke = (expiredPercent / 100) * circumference;
  const nearExpiryStroke = (nearExpiryPercent / 100) * circumference;
  const activeOffset = 0;
  const expiredOffset = -activeStroke;
  const nearExpiryOffset = -(activeStroke + expiredStroke);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Users" value={totalUsers} icon={Users} tone="brand" />
        <StatTile label="Total Products" value={totalProducts} icon={Database} tone="neutral" />
        <StatTile label="Expiring Soon" value={nearExpiry} icon={AlertCircle} tone="warn" />
        <StatTile label="Expired" value={expired} icon={AlertCircle} tone="bad" />
      </div>

      {}
      <div className="grid gap-4 lg:grid-cols-2">
        {}
        <Card>
          <CardHeader title="Platform overview" subtitle="Quick totals across the platform." action={<Activity className="h-4 w-4 text-indigo-600" />} />
          <CardBody>
          <div className="flex items-end justify-around gap-2" style={{ height: '180px' }}>
            {chartData.map((item, i) => {
              const heightPercent = Math.max((item.value / maxVal) * 100, 4);
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-xs font-semibold" style={{ color: item.color }}>{item.value}</span>
                  <div
                    className="w-full max-w-[36px] rounded-t-md transition-all duration-700"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: item.color,
                      minHeight: '6px',
                    }}
                  />
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{item.label}</span>
                </div>
              );
            })}
          </div>
          </CardBody>
        </Card>

        {}
        <Card>
          <CardHeader title="Warranty distribution" subtitle="Active vs expiring vs expired." action={<TrendingUp className="h-4 w-4 text-indigo-600" />} />
          <CardBody>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <svg width="140" height="140" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="18" />
              <circle cx="90" cy="90" r={radius} fill="none" stroke="#22c55e" strokeWidth="18"
                strokeDasharray={`${activeStroke} ${circumference - activeStroke}`}
                strokeDashoffset={activeOffset} transform="rotate(-90 90 90)" strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }} />
              <circle cx="90" cy="90" r={radius} fill="none" stroke="#ef4444" strokeWidth="18"
                strokeDasharray={`${expiredStroke} ${circumference - expiredStroke}`}
                strokeDashoffset={expiredOffset} transform="rotate(-90 90 90)" strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }} />
              <circle cx="90" cy="90" r={radius} fill="none" stroke="#f59e0b" strokeWidth="18"
                strokeDasharray={`${nearExpiryStroke} ${circumference - nearExpiryStroke}`}
                strokeDashoffset={nearExpiryOffset} transform="rotate(-90 90 90)" strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }} />
              <text x="90" y="85" textAnchor="middle" className="text-2xl font-bold" fill="#111827">{totalProducts}</text>
              <text x="90" y="105" textAnchor="middle" className="text-xs" fill="#6b7280">Total</text>
            </svg>
            <div className="space-y-2.5">
              {[
                { label: 'Active', value: active, pct: activePercent, color: 'bg-green-500' },
                { label: 'Expired', value: expired, pct: expiredPercent, color: 'bg-red-500' },
                { label: 'Near Expiry', value: nearExpiry, pct: nearExpiryPercent, color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.value} ({Math.round(item.pct)}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </CardBody>
        </Card>
      </div>

      {}
      {adminData.recentActivity?.length > 0 && (
        <Card>
          <CardHeader title="Recent activity" subtitle="Latest product additions across the platform." />
          <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {adminData.recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-blue-100 p-1.5 text-blue-600">
                    <Database className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                    <p className="text-xs text-gray-500">Added by {item.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default AdminDashboardTab;
