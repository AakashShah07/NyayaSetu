const { body } = require('express-validator');

const createValidator = [
  body('judgment').notEmpty().withMessage('Judgment ID is required').isMongoId(),
  body('directiveText').trim().notEmpty().withMessage('Directive text is required'),
  body('deadline').optional().isISO8601(),
  body('responsibleDepartment').optional().trim(),
  body('confidence').optional().isFloat({ min: 0, max: 1 }),
];

const updateValidator = [
  body('directiveText').optional().trim(),
  body('deadline').optional().isISO8601(),
  body('responsibleDepartment').optional().trim(),
  body('reviewStatus').optional().isIn(['auto_accepted', 'needs_review', 'manually_verified']),
];

module.exports = { createValidator, updateValidator };
