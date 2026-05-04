import client from './client';

export const getAuditLogs = (params) => client.get('/api/audit-logs', { params });
export const getEntityAuditLogs = (entity, entityId) => client.get(`/api/audit-logs/entity/${entity}/${entityId}`);
