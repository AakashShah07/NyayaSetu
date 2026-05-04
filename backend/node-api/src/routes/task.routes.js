const router = require('express').Router();
const ctrl = require('../controllers/task.controller');
const { createValidator, updateValidator } = require('../validators/task.validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { createAuditMiddleware } = require('../middleware/auditLogger');

const audit = createAuditMiddleware('task');

router.use(protect);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: List tasks (filterable, paginated)
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [not_started, in_progress, completed, overdue, archived] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high, critical] }
 *       - in: query
 *         name: department
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200: { description: Paginated task list }
 *   post:
 *     summary: Create a new task from a directive
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Task' }
 *     responses:
 *       201: { description: Task created }
 */
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', createValidator, validate, audit('create'), ctrl.create);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *   delete:
 *     summary: Delete task (admin only)
 *     tags: [Tasks]
 * /tasks/{id}/reassign:
 *   put:
 *     summary: Reassign task to another user (admin only)
 *     tags: [Tasks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedTo: { type: string, description: User ID }
 */
router.put('/:id', updateValidator, validate, audit('update'), ctrl.update);
router.put('/:id/reassign', authorize('admin'), audit('reassign'), ctrl.reassign);
router.delete('/:id', authorize('admin'), audit('delete'), ctrl.remove);

module.exports = router;
