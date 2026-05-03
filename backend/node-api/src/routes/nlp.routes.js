const router = require('express').Router();
const ctrl = require('../controllers/nlp.controller');
const { protect } = require('../middleware/auth');

router.get('/health', protect, ctrl.health);
router.post('/extract/:judgmentId', protect, ctrl.extract);
router.post('/extract-directives/:judgmentId', protect, ctrl.extractDirectives);

module.exports = router;
