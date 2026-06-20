import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.get(`${API_URL}/auth/refresh-token`, {
            headers: { authorization: refreshToken },
          });

          const newAccess = data.data?.accesToken;
          const newRefresh = data.data?.refreshToken;

          if (newAccess) {
            localStorage.setItem('accessToken', newAccess);
            localStorage.setItem('refreshToken', newRefresh);
            originalRequest.headers.authorization = newAccess;
            return api(originalRequest);
          }
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
export { API_URL };
