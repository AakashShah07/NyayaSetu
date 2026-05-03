const router = require('express').Router();
const ctrl = require('../controllers/notification.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', ctrl.getAll);
router.get('/unread-count', ctrl.getUnreadCount);
router.put('/read-all', ctrl.markAllRead);
router.put('/:id/read', ctrl.markRead);
router.put('/:id/dismiss', ctrl.dismiss);
router.put('/:id/snooze', ctrl.snooze);
router.post('/trigger-check', authorize('admin'), ctrl.triggerCheck);

module.exports = router;
