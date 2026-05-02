const router = require('express').Router();
const { register, login, refresh, getMe } = require('../controllers/auth.controller');
const { registerValidator, loginValidator, refreshValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh', refreshValidator, validate, refresh);
router.get('/me', protect, getMe);

module.exports = router;
