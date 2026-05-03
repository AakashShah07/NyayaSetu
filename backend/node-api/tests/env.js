// Set env vars before any module loads
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '7d';
process.env.JWT_REFRESH_EXPIRES_IN = '30d';
process.env.NLP_SERVICE_URL = 'http://localhost:8001';
process.env.NODE_ENV = 'test';
