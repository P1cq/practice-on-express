import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../api/client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((notification) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const token = localStorage.getItem('accessToken');
    const newSocket = io(API_URL, {
      auth: { token },
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
    });

    newSocket.on('new_notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      addToast(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, addToast]);

  const markAllRead = () => setUnreadCount(0);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        toasts,
        markAllRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
