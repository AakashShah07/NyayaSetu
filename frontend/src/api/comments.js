import client from './client';

export const getComments = (entityType, entityId) =>
  client.get('/api/comments', { params: { entityType, entityId } });

export const createComment = (data) =>
  client.post('/api/comments', data);

export const deleteComment = (id) =>
  client.delete(`/api/comments/${id}`);
