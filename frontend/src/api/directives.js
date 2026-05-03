import client from './client';

export const getDirectives = (params) =>
  client.get('/api/directives', { params }).then((r) => r.data);

export const getDirective = (id) =>
  client.get(`/api/directives/${id}`).then((r) => r.data);

export const createDirective = (data) =>
  client.post('/api/directives', data).then((r) => r.data);

export const updateDirective = (id, data) =>
  client.put(`/api/directives/${id}`, data).then((r) => r.data);

export const deleteDirective = (id) =>
  client.delete(`/api/directives/${id}`).then((r) => r.data);
