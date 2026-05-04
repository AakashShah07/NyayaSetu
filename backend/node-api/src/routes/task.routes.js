const router = require('express').Router();
const ctrl = require('../controllers/task.controller');
const { createValidator, updateValidator } = require('../validators/task.validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { createAuditMiddleware } = require('../middleware/auditLogger');

const audit = createAuditMiddleware('task');

router.use(protect);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', createValidator, validate, audit('create'), ctrl.create);
router.put('/:id', updateValidator, validate, audit('update'), ctrl.update);
router.put('/:id/reassign', authorize('admin'), audit('reassign'), ctrl.reassign);
router.delete('/:id', authorize('admin'), audit('delete'), ctrl.remove);

module.exports = router;
