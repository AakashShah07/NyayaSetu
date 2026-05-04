const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getByEntity, create, remove } = require('../controllers/comment.controller');

router.use(protect);

router.get('/', getByEntity);
router.post('/', create);
router.delete('/:id', remove);

module.exports = router;
