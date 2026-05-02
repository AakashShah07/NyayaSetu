const router = require('express').Router();
const ctrl = require('../controllers/nlp.controller');
const { protect } = require('../middleware/auth');

router.get('/health', protect, ctrl.health);
router.post('/extract/:judgmentId', protect, ctrl.extract);

module.exports = router;
