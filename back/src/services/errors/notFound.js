const ServerError = require('./server');

class NotFoundError extends ServerError {
    constructor(message, resource = 'resource') {
        super(
            message || 'Resource Not Found',
            `We're sorry, but the ${resource} you are looking for does not exist. Please make sure your request is correct. Our technical team has been notified and is working to resolve the issue. Please try again later.`,
            `An unexpected error occurred while trying to access the ${resource}. The issue has been logged for investigation.`,
            404
        );

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = NotFoundError;