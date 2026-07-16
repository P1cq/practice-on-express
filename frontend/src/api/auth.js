import api, { API_URL } from './client';

export const signUp = (data) => api.post('/auth/sign-up', data);

// Full-page redirect flow: the backend sets the HttpOnly refresh cookie and
// sends the browser back to /oauth-callback. No Google script is loaded here.
export const googleLoginUrl = `${API_URL}/auth/google`;

// One-Tap / button flow (Google Identity Services): the backend still sets
// the HttpOnly refresh cookie on this response, same as every other login path.
export const signWithGoogle = (idToken) =>
  api.post('/auth/sign-with-google', { idToken });

export const verifyEmail = (email, otp) =>
  api.post('/auth/verifyEmail', { email, otp });

export const resendOtp = (email) => api.post('/auth/re-send-otp', { email });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const logout = () => api.post('/user/black-list');

export const logoutAllDevices = () =>
  api.patch('/user/log-out-from-all-devecis');
