import client from './client';

export const getOverview = () => client.get('/api/analytics/overview');
export const getComplianceRate = (months = 6) => client.get(`/api/analytics/compliance?months=${months}`);
export const getDepartmentPerformance = () => client.get('/api/analytics/departments');
