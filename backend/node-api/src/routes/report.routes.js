const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getDepartmentReport, getCaseReport } = require('../controllers/report.controller');

router.use(protect);

router.get('/department', getDepartmentReport);
router.get('/case/:judgmentId', getCaseReport);

module.exports = router;
