const AuditLog = require('../models/AuditLog');

function createAuditMiddleware(entity) {
  return (action) => async (req, res, next) => {
    // Store original json method to intercept response
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Only log successful mutations
      if (body?.success && req.user) {
        const entityId = req.params.id || body?.data?._id;
        if (entityId) {
          AuditLog.create({
            action,
            entity,
            entityId,
            user: req.user._id,
            userName: req.user.name,
            description: `${req.user.name} ${action}d a ${entity}`,
            changes: action === 'create' ? body.data : req.body,
            ipAddress: req.ip,
          }).catch(() => {}); // Fire and forget
        }
      }
      return originalJson(body);
    };

    next();
  };
}

module.exports = { createAuditMiddleware };
