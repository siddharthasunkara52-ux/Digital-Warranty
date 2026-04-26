import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboardTab from './AdminDashboardTab';
import AllProductsTab from './AllProductsTab';
import UserManagementTab from './UserManagementTab';
import { Menu } from 'lucide-react';

function AdminLayout({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboardTab onNavigate={setActiveTab} />;
      case 'all-products': return <AllProductsTab />;
      case 'users': return <UserManagementTab />;
      default: return <AdminDashboardTab onNavigate={setActiveTab} />;
    }
  };

  const tabLabels = {
    dashboard: 'Admin Dashboard',
    'all-products': 'Global Warranties',
    users: 'User Management',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        active={activeTab}
        onNavigate={setActiveTab}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="flex-1 flex flex-col lg:ml-56 transition-all">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200 transition lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{tabLabels[activeTab] || 'Dashboard'}</h2>
              <p className="text-xs text-gray-500 hidden sm:block">Platform administrator portal</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6">{renderContent()}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
