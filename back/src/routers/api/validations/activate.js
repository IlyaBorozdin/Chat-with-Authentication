const ValidateError = require('../../../services/errors/validate');

const activateValidate = (req, res, next) => {
    if (req.params.link) {
        return next();
    }

    return next(new ValidateError(['Account activation link missing.']));
}

module.exports = activateValidate;