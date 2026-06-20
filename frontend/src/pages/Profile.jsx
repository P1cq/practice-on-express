import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadProfilePic } from '../api/user';
import { logout, logoutAllDevices } from '../api/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, refreshProfile, logoutUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');
    try {
      await uploadProfilePic(file);
      await refreshProfile();
      setMessage('Profile picture updated!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore */
    }
    logoutUser();
    navigate('/');
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllDevices();
      logoutUser();
      navigate('/');
    } catch {
      alert('Failed to logout from all devices');
    }
  };

  const profileImageUrl = user?.profileImage
    ? `${API_URL}/${user.profileImage}`
    : null;

  const shareLink = `${window.location.origin}/u/${user?._id}`;

  return (
    <div className="min-h-screen bg-sage-900 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Profile</h1>

          <div className="bg-sage-800/60 border border-white/5 rounded-3xl p-6 md:p-8">
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-full bg-sage-700 overflow-hidden cursor-pointer border-2 border-white/10 hover:border-sage-400 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-sage-400">
                    {user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="mt-3 text-sm text-sage-400 hover:text-white"
              >
                {uploading ? 'Uploading...' : 'Change photo'}
              </button>
              {message && (
                <p className="text-sm text-green-400 mt-2">{message}</p>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="text-xs text-sage-400">Name</label>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-xs text-sage-400">Email</label>
                <p className="text-white font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-xs text-sage-400">Gender</label>
                <p className="text-white font-medium">
                  {user?.gendar === 0 ? 'Male' : user?.gendar === 1 ? 'Female' : '—'}
                </p>
              </div>
              <div>
                <label className="text-xs text-sage-400">Your share link</label>
                <div className="flex gap-2 mt-1">
                  <input
                    readOnly
                    value={shareLink}
                    className="flex-1 bg-sage-900/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-sage-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert('Copied!');
                    }}
                    className="px-4 py-2 bg-sage-100 text-sage-900 rounded-xl text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 border border-white/10 rounded-xl text-sage-200 hover:bg-white/5 transition-colors text-sm"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={handleLogoutAll}
                className="w-full py-3 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm"
              >
                Logout from all devices
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
