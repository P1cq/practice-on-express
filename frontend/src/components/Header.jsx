import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { logout } from '../api/auth';

export default function Header() {
  const { isAuthenticated, logoutUser } = useAuth();
  const { unreadCount, markAllRead, notifications } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore */
    }
    // flushSync forces the auth-state update to commit (and, if we're on a
    // protected route, ProtectedRoute's own redirect-to-/login to resolve)
    // before we navigate — otherwise that redirect can land after ours and
    // silently override the intended destination.
    flushSync(() => {
      logoutUser();
    });
    navigate('/', { replace: true });
  };

  const navClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors hover:text-paper-50 ${
      isActive ? 'text-paper-50 font-medium' : 'text-pine-200'
    }`;

  return (
    <header className="relative z-50 pine-panel border-b border-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
          <Link
            to="/"
            className="font-display italic text-xl md:text-2xl text-paper-50 tracking-wide"
          >
            sarihnaa
          </Link>

          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
            <NavLink to="/users" className={navClass}>
              Find someone
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navClass}>
                  Inbox
                </NavLink>
                <NavLink to="/profile" className={navClass}>
                  Profile
                </NavLink>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      if (!notifOpen) markAllRead();
                    }}
                    className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Notifications"
                  >
                    <svg
                      className="w-5 h-5 text-paper-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ochre-600 text-paper-50 text-[10px] font-bold rounded-full flex items-center justify-center notification-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-80 card-paper rounded-2xl shadow-2xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-paper-200">
                        <p className="text-sm font-semibold text-ink-900">Notifications</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-sm text-ink-500 text-center">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.slice(0, 10).map((n, i) => (
                            <div
                              key={i}
                              className="px-4 py-3 border-b border-paper-200 last:border-0 hover:bg-paper-100"
                            >
                              <p className="text-sm font-medium text-ink-900">{n.title}</p>
                              <p className="text-xs text-ink-500 mt-1 truncate">
                                {n.message?.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-pine-200 hover:text-paper-50 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Login
                </NavLink>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-paper-50 text-pine-900 rounded-full text-sm font-semibold hover:bg-white transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-white/10 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-paper-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
            <NavLink to="/users" className={navClass} onClick={() => setMenuOpen(false)}>
              Find someone
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navClass} onClick={() => setMenuOpen(false)}>
                  Inbox
                </NavLink>
                <NavLink to="/profile" className={navClass} onClick={() => setMenuOpen(false)}>
                  Profile
                </NavLink>
                <button type="button" onClick={handleLogout} className="text-sm text-pine-200 text-left cursor-pointer">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
                <Link
                  to="/signup"
                  className="inline-block text-center px-5 py-2.5 bg-paper-50 text-pine-900 rounded-full text-sm font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
