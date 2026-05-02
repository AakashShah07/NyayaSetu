const { body } = require('express-validator');

const createValidator = [
  body('directive').notEmpty().withMessage('Directive ID is required').isMongoId(),
  body('judgment').notEmpty().withMessage('Judgment ID is required').isMongoId(),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('assignedTo').optional().isMongoId(),
  body('department').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
];

const updateValidator = [
  body('title').optional().trim(),
  body('status').optional().isIn(['not_started', 'in_progress', 'completed', 'overdue', 'archived']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('dueDate').optional().isISO8601(),
  body('assignedTo').optional().isMongoId(),
];

module.exports = { createValidator, updateValidator };
