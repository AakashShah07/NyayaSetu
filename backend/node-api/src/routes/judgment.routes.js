const router = require('express').Router();
const ctrl = require('../controllers/judgment.controller');
const { updateValidator } = require('../validators/judgment.validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

router.use(protect);

/**
 * @swagger
 * /judgments:
 *   get:
 *     summary: List all judgments (paginated)
 *     tags: [Judgments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated list of judgments }
 */
router.get('/', ctrl.getAll);

/** @swagger
 * /judgments/{id}:
 *   get:
 *     summary: Get judgment by ID
 *     tags: [Judgments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Judgment details }
 *       404: { description: Not found }
 */
router.get('/:id', ctrl.getOne);

/** @swagger
 * /judgments/upload:
 *   post:
 *     summary: Upload a court judgment PDF
 *     tags: [Judgments]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *               caseNumber: { type: string }
 *               courtName: { type: string }
 *     responses:
 *       201: { description: Judgment created }
 */
router.post('/upload', uploadMiddleware.single('file'), ctrl.upload);

/** @swagger
 * /judgments/upload-bulk:
 *   post:
 *     summary: Bulk upload multiple PDFs (max 10)
 *     tags: [Judgments]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       201: { description: Bulk upload started }
 */
router.post('/upload-bulk', uploadMiddleware.array('files', 10), ctrl.bulkUpload);
router.put('/:id', updateValidator, validate, ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
