const logger = require('./logger');

const logHandler = (req, res, next) => {
    logger.info('New request.', {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params
    });
    next();
};

module.exports = logHandler;