const Notification = require('../models/Notification');
const { checkDeadlines } = require('../services/alertScheduler');
const { success, error } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { recipient: req.user.userId, dismissed: false };
    if (req.query.read === 'true') filter.read = true;
    if (req.query.read === 'false') filter.read = false;
    if (req.query.type) filter.type = req.query.type;

    // Exclude snoozed notifications
    filter.$or = [
      { snoozedUntil: null },
      { snoozedUntil: { $lte: new Date() } },
    ];

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('task', 'title status dueDate department'),
      Notification.countDocuments(filter),
    ]);

    return success(res, notifications, 'Notifications retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.userId,
      read: false,
      dismissed: false,
      $or: [
        { snoozedUntil: null },
        { snoozedUntil: { $lte: new Date() } },
      ],
    });
    return success(res, { count }, 'Unread count retrieved');
  } catch (err) {
    next(err);
  }
};

const markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.userId },
      { read: true },
      { new: true }
    );
    if (!notification) return error(res, 'Notification not found', 404);
    return success(res, notification, 'Marked as read');
  } catch (err) {
    next(err);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.userId, read: false },
      { read: true }
    );
    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

const dismiss = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.userId },
      { dismissed: true },
      { new: true }
    );
    if (!notification) return error(res, 'Notification not found', 404);
    return success(res, notification, 'Notification dismissed');
  } catch (err) {
    next(err);
  }
};

const snooze = async (req, res, next) => {
  try {
    const { until } = req.body;
    if (!until) return error(res, 'Snooze date is required', 400);

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.userId },
      { snoozedUntil: new Date(until) },
      { new: true }
    );
    if (!notification) return error(res, 'Notification not found', 404);
    return success(res, notification, 'Notification snoozed');
  } catch (err) {
    next(err);
  }
};

const triggerCheck = async (req, res, next) => {
  try {
    const alertsCreated = await checkDeadlines();
    return success(res, { alertsCreated }, 'Alert check completed');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getUnreadCount, markRead, markAllRead, dismiss, snooze, triggerCheck };
