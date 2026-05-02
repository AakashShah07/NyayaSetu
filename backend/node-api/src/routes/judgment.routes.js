const router = require('express').Router();
const ctrl = require('../controllers/judgment.controller');
const { updateValidator } = require('../validators/judgment.validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

router.use(protect);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/upload', uploadMiddleware.single('file'), ctrl.upload);
router.put('/:id', updateValidator, validate, ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
