import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getProfile } from '../api/user';
import { refreshAccessToken } from '../api/client';
import { setAccessToken, clearAccessToken } from '../api/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await getProfile();
      setUser(data.user);
    } catch {
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Access tokens live only in memory, so every fresh page load re-derives
    // the session from the HttpOnly refresh cookie before anything else runs.
    (async () => {
      try {
        await refreshAccessToken();
        await fetchProfile();
      } catch {
        setUser(null);
        setLoading(false);
      }
    })();
  }, [fetchProfile]);

  const loginUser = (accessToken) => {
    setAccessToken(accessToken);
    setLoading(true);
    fetchProfile();
  };

  const logoutUser = () => {
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
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
