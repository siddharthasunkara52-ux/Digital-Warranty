import { useEffect, useState } from 'react';
import Login from './components/Login';
import UserLayout from './components/user/UserLayout';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) setRole(savedRole);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('user');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {isLoggedIn ? (
        role === 'admin' ? (
          <AdminLayout onLogout={handleLogout} />
        ) : (
          <UserLayout onLogout={handleLogout} />
        )
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

export default App;