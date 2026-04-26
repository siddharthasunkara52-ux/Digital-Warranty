import { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserDashboardTab from './UserDashboardTab';
import MyProductsTab from './MyProductsTab';
import MaintenanceTab from './MaintenanceTab';
import NotificationsTab from './NotificationsTab';
import ProfileTab from './ProfileTab';
import { Menu, Bell } from 'lucide-react';

function UserLayout({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <UserDashboardTab onNavigate={setActiveTab} />;
      case 'products': return <MyProductsTab />;
      case 'maintenance': return <MaintenanceTab />;
      case 'notifications': return <NotificationsTab />;
      case 'profile': return <ProfileTab />;
      default: return <UserDashboardTab onNavigate={setActiveTab} />;
    }
  };

  const tabLabels = {
    dashboard: 'Dashboard',
    products: 'My Products',
    maintenance: 'Maintenance',
    notifications: 'Notifications',
    profile: 'Profile',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar
        active={activeTab}
        onNavigate={setActiveTab}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="flex-1 flex flex-col lg:ml-56 transition-all">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200/80 bg-white/80 backdrop-blur-md px-4 py-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200 transition lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{tabLabels[activeTab] || 'Dashboard'}</h2>
              <p className="text-xs text-gray-500 hidden sm:block">Manage your warranties and assets</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative rounded-md p-1.5 text-gray-500 hover:bg-gray-100 transition"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6">{renderContent()}</div>
      </main>
    </div>
  );
}

export default UserLayout;
