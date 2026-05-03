import client from './client';

export const getUsers = (params) =>
  client.get('/api/users', { params }).then((r) => r.data);

export const getUser = (id) =>
  client.get(`/api/users/${id}`).then((r) => r.data);

export const updateUser = (id, data) =>
  client.put(`/api/users/${id}`, data).then((r) => r.data);
