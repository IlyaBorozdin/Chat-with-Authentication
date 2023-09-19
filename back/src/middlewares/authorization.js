const Admin = require('../services/admin');
const PermissionError = require('../services/errors/permission');

const authorization = (req, res, next) => {
    const admin = new Admin(req.body);

    if (admin.confirm()) {
        return next();
    }
    return next(new PermissionError(req.url, req.method));
}

module.exports = authorization;