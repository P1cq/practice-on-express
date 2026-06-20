import api from './client';

export const signUp = (data) => api.post('/auth/sign-up', data);

export const verifyEmail = (email, otp) =>
  api.post('/auth/verifyEmail', { email, otp });

export const resendOtp = (email) => api.post('/auth/re-send-otp', { email });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const logout = () => api.post('/user/black-list');

export const logoutAllDevices = () =>
  api.patch('/user/log-out-from-all-devecis');
