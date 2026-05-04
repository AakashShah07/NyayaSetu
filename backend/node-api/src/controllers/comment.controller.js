const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { success, error } = require('../utils/apiResponse');

// GET /api/comments?entityType=task&entityId=...
const getByEntity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.query;
    if (!entityType || !entityId) {
      return error(res, 'entityType and entityId are required', 400);
    }

    const comments = await Comment.find({ entityType, entityId })
      .sort('createdAt')
      .populate('author', 'name email role')
      .populate('mentions', 'name email');

    return success(res, comments, 'Comments retrieved');
  } catch (err) {
    next(err);
  }
};

// POST /api/comments
const create = async (req, res, next) => {
  try {
    const { body, entityType, entityId, mentions } = req.body;

    if (!body || !entityType || !entityId) {
      return error(res, 'body, entityType, and entityId are required', 400);
    }

    const comment = await Comment.create({
      body,
      entityType,
      entityId,
      author: req.user._id,
      mentions: mentions || [],
    });

    // Create notifications for mentioned users
    if (mentions && mentions.length > 0) {
      const notifications = mentions.map((userId) => ({
        recipient: userId,
        type: 'mention',
        title: 'You were mentioned in a comment',
        message: `${req.user.name} mentioned you: "${body.substring(0, 80)}"`,
        priority: 'medium',
        relatedEntity: { type: entityType, id: entityId },
      }));
      await Notification.insertMany(notifications).catch(() => {});
    }

    const populated = await comment.populate('author', 'name email role');
    return success(res, populated, 'Comment added', 201);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/comments/:id
const remove = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return error(res, 'Comment not found', 404);

    // Only author or admin can delete
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return error(res, 'Not authorized to delete this comment', 403);
    }

    await comment.deleteOne();
    return success(res, null, 'Comment deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getByEntity, create, remove };
