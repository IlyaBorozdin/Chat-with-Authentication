const logger = require('../logger/logger');

const errorHandlerJSON = (err, req, res, next) => {
    logger.error('Error.', err);
    return res.status(err.statusCode).json(err);
};

module.exports = errorHandlerJSON;