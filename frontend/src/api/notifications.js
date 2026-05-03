import client from './client';

export const getNotifications = (params) =>
  client.get('/api/notifications', { params }).then((r) => r.data);

export const getUnreadCount = () =>
  client.get('/api/notifications/unread-count').then((r) => r.data);

export const markRead = (id) =>
  client.put(`/api/notifications/${id}/read`).then((r) => r.data);

export const markAllRead = () =>
  client.put('/api/notifications/read-all').then((r) => r.data);

export const dismissNotification = (id) =>
  client.put(`/api/notifications/${id}/dismiss`).then((r) => r.data);

export const snoozeNotification = (id, until) =>
  client.put(`/api/notifications/${id}/snooze`, { until }).then((r) => r.data);

export const triggerAlertCheck = () =>
  client.post('/api/notifications/trigger-check').then((r) => r.data);
