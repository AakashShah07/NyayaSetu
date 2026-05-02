const { body } = require('express-validator');

const createValidator = [
  body('task').notEmpty().withMessage('Task ID is required').isMongoId(),
  body('newStatus').notEmpty().withMessage('New status is required')
    .isIn(['not_started', 'in_progress', 'completed', 'overdue', 'archived']),
  body('notes').optional().trim(),
];

module.exports = { createValidator };
