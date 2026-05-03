import client from './client';

export const getJudgments = (params) =>
  client.get('/api/judgments', { params }).then((r) => r.data);

export const getJudgment = (id) =>
  client.get(`/api/judgments/${id}`).then((r) => r.data);

export const uploadJudgment = (formData) =>
  client.post('/api/judgments/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  }).then((r) => r.data);

export const updateJudgment = (id, data) =>
  client.put(`/api/judgments/${id}`, data).then((r) => r.data);

export const deleteJudgment = (id) =>
  client.delete(`/api/judgments/${id}`).then((r) => r.data);

export const bulkUploadJudgments = (formData) =>
  client.post('/api/judgments/upload-bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  }).then((r) => r.data);
