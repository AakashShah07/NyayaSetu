import client from './client';

export const getDepartmentReport = (params) => client.get('/api/reports/department', { params });
export const getCaseReport = (judgmentId) => client.get(`/api/reports/case/${judgmentId}`);
