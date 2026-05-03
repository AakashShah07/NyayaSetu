const router = require('express').Router();
const ctrl = require('../controllers/nlp.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/health', protect, ctrl.health);
router.post('/extract/:judgmentId', protect, ctrl.extract);
router.post('/extract-directives/:judgmentId', protect, ctrl.extractDirectives);
router.post('/extract-directives-from-text/:judgmentId', protect, ctrl.extractDirectivesFromText);
router.get('/queue/status', protect, ctrl.queueStatus);
router.get('/system-stats', protect, authorize('admin'), ctrl.systemStats);

module.exports = router;
