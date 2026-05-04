const Task = require('../models/Task');
const Directive = require('../models/Directive');
const { success } = require('../utils/apiResponse');

// GET /api/analytics/overview
const getOverview = async (req, res, next) => {
  try {
    const [statusAgg, priorityAgg, totalDirectives] = await Promise.all([
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Directive.countDocuments(),
    ]);

    const byStatus = Object.fromEntries(statusAgg.map((s) => [s._id, s.count]));
    const byPriority = Object.fromEntries(priorityAgg.map((p) => [p._id, p.count]));
    const totalTasks = Object.values(byStatus).reduce((a, b) => a + b, 0);

    return success(res, {
      totalTasks,
      totalDirectives,
      byStatus,
      byPriority,
    }, 'Analytics overview');
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/compliance
const getComplianceRate = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const pipeline = [
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          overdue: {
            $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ];

    const results = await Task.aggregate(pipeline);

    const data = results.map((r) => ({
      month: `${r._id.year}-${String(r._id.month).padStart(2, '0')}`,
      total: r.total,
      completed: r.completed,
      overdue: r.overdue,
      complianceRate: r.total > 0 ? Math.round((r.completed / r.total) * 100) : 0,
    }));

    return success(res, data, 'Compliance rate by month');
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/departments
const getDepartmentPerformance = async (req, res, next) => {
  try {
    const pipeline = [
      { $match: { department: { $ne: null } } },
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          overdue: {
            $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] },
          },
          avgEscalation: { $avg: '$escalationLevel' },
        },
      },
      { $sort: { total: -1 } },
    ];

    const results = await Task.aggregate(pipeline);

    const data = results.map((r) => ({
      department: r._id,
      total: r.total,
      completed: r.completed,
      overdue: r.overdue,
      inProgress: r.inProgress,
      complianceRate: r.total > 0 ? Math.round((r.completed / r.total) * 100) : 0,
      avgEscalation: Math.round((r.avgEscalation || 0) * 10) / 10,
    }));

    return success(res, data, 'Department performance');
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview, getComplianceRate, getDepartmentPerformance };
