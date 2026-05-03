import client from './client';

export const getStatusUpdates = (params) =>
  client.get('/api/status-updates', { params }).then((r) => r.data);

export const createStatusUpdate = (data) =>
  client.post('/api/status-updates', data).then((r) => r.data);
