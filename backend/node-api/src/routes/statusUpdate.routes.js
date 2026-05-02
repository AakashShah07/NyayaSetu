const router = require('express').Router();
const ctrl = require('../controllers/statusUpdate.controller');
const { createValidator } = require('../validators/statusUpdate.validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', ctrl.getAll);
router.post('/', createValidator, validate, ctrl.create);

module.exports = router;
