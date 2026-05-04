const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getOverview, getComplianceRate, getDepartmentPerformance } = require('../controllers/analytics.controller');

router.use(protect);

router.get('/overview', getOverview);
router.get('/compliance', getComplianceRate);
router.get('/departments', getDepartmentPerformance);

module.exports = router;
