import client from './client';

export const getOverview = () => client.get('/analytics/overview');
export const getComplianceRate = (months = 6) => client.get(`/analytics/compliance?months=${months}`);
export const getDepartmentPerformance = () => client.get('/analytics/departments');
