import client from './client';

export const checkHealth = () =>
  client.get('/api/nlp/health').then((r) => r.data);

export const extractText = (judgmentId) =>
  client.post(`/api/nlp/extract/${judgmentId}`, null, { timeout: 120000 }).then((r) => r.data);

export const extractDirectives = (judgmentId) =>
  client.post(`/api/nlp/extract-directives/${judgmentId}`, null, { timeout: 180000 }).then((r) => r.data);

export const extractDirectivesFromText = (judgmentId, text) =>
  client.post(`/api/nlp/extract-directives-from-text/${judgmentId}`, { text }, { timeout: 180000 }).then((r) => r.data);

export const getQueueStatus = () =>
  client.get('/api/nlp/queue/status').then((r) => r.data);

export const getSystemStats = () =>
  client.get('/api/nlp/system-stats').then((r) => r.data);
