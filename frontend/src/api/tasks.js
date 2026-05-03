import client from './client';

export const getTasks = (params) =>
  client.get('/api/tasks', { params }).then((r) => r.data);

export const getTask = (id) =>
  client.get(`/api/tasks/${id}`).then((r) => r.data);

export const createTask = (data) =>
  client.post('/api/tasks', data).then((r) => r.data);

export const updateTask = (id, data) =>
  client.put(`/api/tasks/${id}`, data).then((r) => r.data);

export const deleteTask = (id) =>
  client.delete(`/api/tasks/${id}`).then((r) => r.data);
