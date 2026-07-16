import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadProfilePic } from '../api/user';
import { logout, logoutAllDevices } from '../api/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { safeUrl } from '../utils/safeUrl';
import { validateFiles, ALLOWED_PROFILE_IMAGE_TYPES } from '../utils/fileValidation';

export default function Profile() {
  const { user, refreshProfile, logoutUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileError = validateFiles([file], ALLOWED_PROFILE_IMAGE_TYPES);
    if (fileError) {
      setMessage(fileError);
      e.target.value = '';
      return;
    }

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
    // See Header.jsx's handleLogout for why this needs flushSync: Profile is
    // a protected route, so its own redirect-to-/login can otherwise race
    // ahead of this navigate and win.
    flushSync(() => {
      logoutUser();
    });
    navigate('/', { replace: true });
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllDevices();
      flushSync(() => {
        logoutUser();
      });
      navigate('/', { replace: true });
    } catch {
      alert('Failed to logout from all devices');
    }
  };

  const profileImageUrl = user?.profileImage
    ? safeUrl(`${API_URL}/${user.profileImage}`)
    : null;

  const shareLink = `${window.location.origin}/u/${user?._id}`;

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 md:py-14 paper-grain">
        <div className="max-w-lg mx-auto">
          <p className="text-xs tracking-[0.18em] uppercase text-ochre-700 font-semibold mb-1.5">
            Your account
          </p>
          <h1 className="font-display text-2xl md:text-3xl text-ink-900 mb-8">Profile</h1>

          <div className="card-paper rounded-2xl p-6 md:p-8">
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-full bg-pine-100 overflow-hidden cursor-pointer border-2 border-paper-300 hover:border-pine-600 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-display text-pine-700">
                    {user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={ALLOWED_PROFILE_IMAGE_TYPES.join(',')}
                onChange={handleUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="mt-3 text-sm text-ink-500 hover:text-pine-800 cursor-pointer"
              >
                {uploading ? 'Uploading...' : 'Change photo'}
              </button>
              {message && (
                <p className="text-sm text-pine-700 mt-2">{message}</p>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="text-xs text-ink-400">Name</label>
                <p className="text-ink-900 font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-xs text-ink-400">Email</label>
                <p className="text-ink-900 font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-xs text-ink-400">Gender</label>
                <p className="text-ink-900 font-medium">
                  {user?.gendar === 0 ? 'Male' : user?.gendar === 1 ? 'Female' : '—'}
                </p>
              </div>
              <div>
                <label className="text-xs text-ink-400">Your share link</label>
                <div className="flex gap-2 mt-1">
                  <input
                    readOnly
                    value={shareLink}
                    className="flex-1 bg-paper-100 border border-paper-300 rounded-xl px-3 py-2 text-sm text-ink-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert('Copied!');
                    }}
                    className="btn-primary px-4 py-2 text-sm rounded-xl"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-paper-200 space-y-3">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 border border-paper-300 rounded-xl text-ink-700 hover:bg-paper-100 transition-colors text-sm cursor-pointer"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={handleLogoutAll}
                className="w-full py-3 border border-rose-700/25 rounded-xl text-rose-700 hover:bg-rose-700/5 transition-colors text-sm cursor-pointer"
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
