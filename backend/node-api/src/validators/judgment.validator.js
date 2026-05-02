const { body } = require('express-validator');

const createValidator = [
  body('caseId').trim().notEmpty().withMessage('Case ID is required'),
  body('courtName').optional().trim(),
  body('judgmentDate').optional().isISO8601().withMessage('Invalid date format'),
];

const updateValidator = [
  body('caseId').optional().trim(),
  body('courtName').optional().trim(),
  body('judgmentDate').optional().isISO8601().withMessage('Invalid date format'),
];

module.exports = { createValidator, updateValidator };
