const Task = require('../models/Task');
const StatusUpdate = require('../models/StatusUpdate');
const { success, error } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || '-createdAt';
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.judgment) filter.judgment = req.query.judgment;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('assignedTo', 'name email')
        .populate('directive', 'directiveText deadline')
        .populate('judgment', 'caseId courtName'),
      Task.countDocuments(filter),
    ]);

    return success(res, tasks, 'Tasks retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email department')
      .populate('directive')
      .populate('judgment', 'caseId courtName fileUrl');

    if (!task) return error(res, 'Task not found', 404);

    const statusHistory = await StatusUpdate.find({ task: task._id })
      .sort('createdAt')
      .populate('updatedBy', 'name');

    return success(res, { task, statusHistory });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    return success(res, task, 'Task created', 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return error(res, 'Task not found', 404);

    const previousStatus = task.status;

    if (req.body.status === 'completed' && !task.completedAt) {
      req.body.completedAt = new Date();
    }

    Object.assign(task, req.body);
    await task.save();

    if (req.body.status && req.body.status !== previousStatus) {
      await StatusUpdate.create({
        task: task._id,
        previousStatus,
        newStatus: req.body.status,
        updatedBy: req.user.userId,
        notes: req.body.notes || `Status changed from ${previousStatus} to ${req.body.status}`,
      });
    }

    return success(res, task, 'Task updated');
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return error(res, 'Task not found', 404);
    return success(res, null, 'Task deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
