const router = require('express').Router();
const ctrl = require('../controllers/task.controller');
const { createValidator, updateValidator } = require('../validators/task.validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', createValidator, validate, ctrl.create);
router.put('/:id', updateValidator, validate, ctrl.update);
router.put('/:id/reassign', authorize('admin'), ctrl.reassign);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
