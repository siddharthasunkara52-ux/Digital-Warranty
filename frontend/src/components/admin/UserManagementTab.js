import { useEffect, useState, useCallback } from 'react';
import Spinner from '../Spinner';
import Toast from '../Toast';
import ConfirmDialog from '../common/ConfirmDialog';
import { Trash2, ShieldAlert, User, Mail, Shield } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { getAllUsers, deleteUser as deleteUserApi } from '../../services/adminService';

function UserManagementTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();
  const [confirmTarget, setConfirmTarget] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data.users || data || []);
    } catch (err) {
      showToast('Failed to load system users', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    try {
      await deleteUserApi(confirmTarget._id);
      showToast('User deleted successfully', 'success');
      fetchUsers();
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
    setConfirmTarget(null);
  };

  if (loading) return <Spinner text="Loading users..." />;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-0.5">User Registry</h3>
        <p className="text-sm text-gray-500">Manage all registered accounts. Deleting a user removes all their data.</p>
      </div>

      {}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {}
        <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_100px_80px] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span></span>
        </div>

        {}
        <div className="divide-y divide-gray-50">
          {users.map(user => (
            <div key={user._id} className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_1fr_100px_80px] sm:gap-4 sm:items-center px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className={`rounded-full p-1.5 ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
              </div>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 sm:hidden" /> {user.email}
              </span>
              <span className={`inline-flex w-fit items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                {user.role === 'admin' ? <ShieldAlert className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                {user.role}
              </span>
              <div>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => setConfirmTarget(user)}
                    className="flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <p className="text-sm text-gray-500 py-6 text-center">No users found.</p>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmTarget}
        title="Delete User"
        message={`Are you sure you want to delete "${confirmTarget?.name}"? This will remove all their products and maintenance records.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
        confirmLabel="Delete User"
      />

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

export default UserManagementTab;
