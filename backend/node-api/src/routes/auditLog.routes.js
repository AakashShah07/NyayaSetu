const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { getAll, getByEntity } = require('../controllers/auditLog.controller');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAll);
router.get('/entity/:entity/:entityId', getByEntity);

module.exports = router;
