import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { logout } from '../api/auth';

export default function Header({ variant = 'home' }) {
  const { isAuthenticated, user, logoutUser } = useAuth();
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
    logoutUser();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors hover:text-white ${
      isActive ? 'text-white font-medium' : 'text-sage-200'
    }`;

  const isHome = variant === 'home';

  return (
    <header
      className={`relative z-50 ${
        isHome ? 'bg-transparent' : 'bg-sage-950/80 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="font-display text-lg md:text-xl text-sage-100 tracking-wider lowercase"
          >
            sarihnaa
          </Link>

          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
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
                    className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Notifications"
                  >
                    <svg
                      className="w-5 h-5 text-sage-100"
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
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center notification-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute left-0 mt-2 w-80 bg-sage-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium">الإشعارات</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-sm text-sage-400 text-center">
                            لا توجد إشعارات
                          </p>
                        ) : (
                          notifications.slice(0, 10).map((n, i) => (
                            <div
                              key={i}
                              className="px-4 py-3 border-b border-white/5 hover:bg-white/5"
                            >
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-sage-400 mt-1 truncate">
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
                  className="text-sm text-sage-200 hover:text-white transition-colors"
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
                  className="px-5 py-2.5 bg-sage-100 text-sage-900 rounded-full text-sm font-medium hover:bg-white transition-colors"
                >
                  get started
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navClass} onClick={() => setMenuOpen(false)}>
                  Inbox
                </NavLink>
                <NavLink to="/profile" className={navClass} onClick={() => setMenuOpen(false)}>
                  Profile
                </NavLink>
                <button type="button" onClick={handleLogout} className="text-sm text-sage-200 text-right">
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
                  className="inline-block text-center px-5 py-2.5 bg-sage-100 text-sage-900 rounded-full text-sm font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  get started
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
