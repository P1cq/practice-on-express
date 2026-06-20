import api from './client';

export const getMessages = () => api.get('/messages/');

export const getMessage = (id) => api.get(`/messages/${id}`);

export const deleteMessage = (id) => api.delete(`/messages/${id}`);

export const sendAnonymousMessage = (receiverId, content, files = []) => {
  const formData = new FormData();
  formData.append('content', content);
  files.forEach((file) => formData.append('attachments', file));
  return api.post(`/messages/anonymous/${receiverId}`, formData);
};

export const sendPublicMessage = (receiverId, content, files = []) => {
  const formData = new FormData();
  formData.append('content', content);
  files.forEach((file) => formData.append('attachments', file));
  return api.post(`/messages/public/${receiverId}`, formData);
};
