import { useEffect, useState } from 'react';
import { User, Mail, ShieldCheck, MapPin, Phone } from 'lucide-react';
import Spinner from '../Spinner';
import Toast from '../Toast';
import { useToast } from '../../hooks/useToast';
import { getProfile, updateProfile } from '../../services/authService';

function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || ''
      });
    } catch (err) {
      console.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      showToast('Profile updated successfully!', 'success');
      await fetchProfile();
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner text="Loading profile..." />;
  if (!profile) return null;

  return (
    <div className="space-y-4 max-w-2xl">
      {}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400 flex-shrink-0">
            <User className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Phone className="h-3.5 w-3.5" /> {profile.phone}
                </span>
              )}
              {profile.address && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" /> {profile.address}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 mt-2 text-xs font-medium text-blue-700 border border-blue-100">
              <ShieldCheck className="h-3 w-3" />
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Account Settings</h3>
        <p className="text-sm text-gray-500 mb-4">Update your profile information below.</p>
        
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input disabled type="email" value={profile.email} className="block w-full rounded-md border border-gray-200 bg-gray-100 py-2 px-3 text-sm text-gray-500 outline-none cursor-not-allowed" />
            <p className="mt-0.5 text-xs text-gray-400">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="e.g. +91 12345 67890" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address (optional)</label>
            <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Your address" className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>
          <button disabled={saving} type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

export default ProfileTab;
