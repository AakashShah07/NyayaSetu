const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getOverview, getComplianceRate, getDepartmentPerformance } = require('../controllers/analytics.controller');

router.use(protect);

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get task overview (by status & priority)
 *     tags: [Analytics]
 *     responses:
 *       200: { description: Task counts by status and priority }
 * /analytics/compliance:
 *   get:
 *     summary: Get monthly compliance rate
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: integer, default: 6 }
 *     responses:
 *       200: { description: Monthly compliance data }
 * /analytics/departments:
 *   get:
 *     summary: Get department performance metrics
 *     tags: [Analytics]
 *     responses:
 *       200: { description: Per-department task stats }
 */
router.get('/overview', getOverview);
router.get('/compliance', getComplianceRate);
router.get('/departments', getDepartmentPerformance);

module.exports = router;
