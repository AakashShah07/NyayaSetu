import client from './client';

export const checkHealth = () =>
  client.get('/api/nlp/health').then((r) => r.data);

export const extractText = (judgmentId) =>
  client.post(`/api/nlp/extract/${judgmentId}`, null, { timeout: 120000 }).then((r) => r.data);

export const extractDirectives = (judgmentId) =>
  client.post(`/api/nlp/extract-directives/${judgmentId}`, null, { timeout: 180000 }).then((r) => r.data);
