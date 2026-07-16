import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken, getCookie } from './tokenStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

// Refresh cycle relies on the HttpOnly refresh-token cookie set by the backend;
// the access token itself is never persisted, only kept in memory (tokenStore).
//
// The backend rotates the refresh token on every call and rejects reuse of an
// already-rotated one (session-hijack detection). Two callers racing to refresh
// at once (StrictMode's double effect invocation, or two API calls 401-ing at
// the same time) would otherwise send the same stale cookie twice and the
// second call would trip that reuse check, logging the user out everywhere.
// Sharing one in-flight promise keeps concurrent callers on a single call.
let refreshPromise = null;

export function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/refresh-token`, {
        withCredentials: true,
        headers: { 'x-csrf-token': getCookie('csrfToken') || '' },
      });
      const newAccess = data.data?.accesToken;
      if (!newAccess) throw new Error('No access token returned');
      setAccessToken(newAccess);
      return newAccess;
    } catch (err) {
      clearAccessToken();
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccess = await refreshAccessToken();
        originalRequest.headers.authorization = newAccess;
        return api(originalRequest);
      } catch {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
export { API_URL };
