import { LayoutDashboard, Tag, Wrench, Bell, UserCircle, LogOut, Shield, X } from 'lucide-react';

function UserSidebar({ active, onNavigate, onLogout, mobileOpen, onCloseMobile }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products', label: 'My Products', icon: Tag },
    { key: 'maintenance', label: 'Maintenance', icon: Wrench },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'profile', label: 'Profile', icon: UserCircle }
  ];

  const handleNav = (key) => {
    onNavigate(key);
    onCloseMobile?.();
  };

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-5">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">WarrantyTracker</span>
        </div>
        <button onClick={onCloseMobile} className="rounded p-1 text-gray-400 hover:text-gray-600 lg:hidden">
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 mt-4 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNav(item.key)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-gray-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-900/40" onClick={onCloseMobile} />
          <aside className="absolute inset-y-0 left-0 z-50 flex w-56 flex-col bg-white shadow-lg">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export default UserSidebar;
