import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getProfile } from '../api/user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!localStorage.getItem('accessToken');

  const fetchProfile = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await getProfile();
      setUser(data.user);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const loginUser = (tokens, userId) => {
    localStorage.setItem('accessToken', tokens.accesToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('userId', userId);
    fetchProfile();
  };

  const logoutUser = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        loginUser,
        logoutUser,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
