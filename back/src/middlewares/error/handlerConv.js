const ServerError = require('../../services/errors/server');

const errorHandlerConv = (err, req, res, next) => {
    const serverError = err instanceof ServerError ? err : new ServerError();
    return next(Object.assign({}, serverError, { message: serverError.message}));
};

module.exports = errorHandlerConv;