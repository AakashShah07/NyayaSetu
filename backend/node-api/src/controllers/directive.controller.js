const Directive = require('../models/Directive');
const { success, error } = require('../utils/apiResponse');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || '-createdAt';
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.judgment) filter.judgment = req.query.judgment;
    if (req.query.department) filter.responsibleDepartment = req.query.department;
    if (req.query.reviewStatus) filter.reviewStatus = req.query.reviewStatus;

    const [directives, total] = await Promise.all([
      Directive.find(filter).sort(sort).skip(skip).limit(limit).populate('judgment', 'caseId courtName'),
      Directive.countDocuments(filter),
    ]);

    return success(res, directives, 'Directives retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const directive = await Directive.findById(req.params.id).populate('judgment');
    if (!directive) return error(res, 'Directive not found', 404);
    return success(res, directive);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const directive = await Directive.create(req.body);
    return success(res, directive, 'Directive created', 201);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const directive = await Directive.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!directive) return error(res, 'Directive not found', 404);
    return success(res, directive, 'Directive updated');
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const directive = await Directive.findByIdAndDelete(req.params.id);
    if (!directive) return error(res, 'Directive not found', 404);
    return success(res, null, 'Directive deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
