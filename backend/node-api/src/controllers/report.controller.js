const Task = require('../models/Task');
const Directive = require('../models/Directive');
const Judgment = require('../models/Judgment');
const { success } = require('../utils/apiResponse');

// GET /api/reports/department?department=...&startDate=...&endDate=...
const getDepartmentReport = async (req, res, next) => {
  try {
    const { department, startDate, endDate } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('directive', 'directiveText deadline')
      .populate('judgment', 'caseNumber courtName')
      .sort({ dueDate: 1 })
      .lean();

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const overdue = tasks.filter((t) => t.status === 'overdue').length;
    const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return success(res, {
      department: department || 'All Departments',
      period: { startDate: startDate || null, endDate: endDate || null },
      summary: { total, completed, overdue, inProgress: total - completed - overdue, complianceRate },
      tasks: tasks.map((t) => ({
        id: t._id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        completedAt: t.completedAt,
        assignedTo: t.assignedTo?.name || 'Unassigned',
        caseNumber: t.judgment?.caseNumber || 'N/A',
        courtName: t.judgment?.courtName || 'N/A',
        directiveText: t.directive?.directiveText?.substring(0, 100) || '',
      })),
    }, 'Department compliance report');
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/case/:judgmentId
const getCaseReport = async (req, res, next) => {
  try {
    const { judgmentId } = req.params;

    const [judgment, directives, tasks] = await Promise.all([
      Judgment.findById(judgmentId).lean(),
      Directive.find({ judgment: judgmentId }).lean(),
      Task.find({ judgment: judgmentId }).populate('assignedTo', 'name email').lean(),
    ]);

    if (!judgment) {
      return res.status(404).json({ success: false, message: 'Judgment not found' });
    }

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;

    return success(res, {
      judgment: {
        id: judgment._id,
        caseNumber: judgment.caseNumber,
        courtName: judgment.courtName,
        judgmentDate: judgment.judgmentDate,
      },
      summary: {
        totalDirectives: directives.length,
        totalTasks: total,
        completed,
        overdue: tasks.filter((t) => t.status === 'overdue').length,
        complianceRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
      directives: directives.map((d) => ({
        id: d._id,
        text: d.directiveText,
        deadline: d.deadline,
        department: d.responsibleDepartment,
        status: d.reviewStatus,
      })),
      tasks: tasks.map((t) => ({
        id: t._id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        assignedTo: t.assignedTo?.name || 'Unassigned',
      })),
    }, 'Case compliance report');
  } catch (err) {
    next(err);
  }
};

module.exports = { getDepartmentReport, getCaseReport };
