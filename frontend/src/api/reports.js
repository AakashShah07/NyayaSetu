import client from './client';

export const getDepartmentReport = (params) => client.get('/reports/department', { params });
export const getCaseReport = (judgmentId) => client.get(`/reports/case/${judgmentId}`);
