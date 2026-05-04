const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NyayaSetu API',
      version: '1.0.0',
      description: 'AI-Powered Court Order Compliance Tracking API for Indian government departments. Extracts directives and deadlines from court judgment PDFs using NLP.',
      contact: { name: 'NyayaSetu Team' },
    },
    servers: [
      { url: '/api', description: 'API server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'department_head', 'officer'] },
            department: { type: 'string', enum: ['Social Welfare', 'Environment', 'Police', 'General'] },
          },
        },
        Judgment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            caseNumber: { type: 'string' },
            courtName: { type: 'string' },
            judgmentDate: { type: 'string', format: 'date' },
            extractionStatus: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
            extractedText: { type: 'string' },
          },
        },
        Directive: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            directiveText: { type: 'string' },
            deadline: { type: 'string', format: 'date' },
            responsibleDepartment: { type: 'string' },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
            reviewStatus: { type: 'string', enum: ['auto_accepted', 'needs_review', 'manually_verified'] },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            status: { type: 'string', enum: ['not_started', 'in_progress', 'completed', 'overdue', 'archived'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            dueDate: { type: 'string', format: 'date' },
            department: { type: 'string' },
            assignedTo: { type: 'string' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                pages: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
