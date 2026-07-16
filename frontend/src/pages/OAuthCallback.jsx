import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // AuthProvider already runs its own refreshAccessToken() + fetchProfile()
    // cycle on every mount (including this one) to re-derive the session from
    // the HttpOnly refresh cookie the backend just set. Calling that cycle a
    // second time here would race it — whichever finished last would win,
    // sometimes navigating to /dashboard before the real session existed. So
    // this page just waits for that one cycle to settle, then routes off its
    // result.
    if (loading) return;
    navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4">
      <div className="w-10 h-10 border-3 border-pine-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
