import api from './client';

export const getProfile = () => api.get('/user/profile');

export const getUsers = () => api.get('/user/');

export const uploadProfilePic = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.patch('/user/upload-pic-profile', formData);
};
