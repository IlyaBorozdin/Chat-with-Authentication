const ServerError = require('./server');

class PermissionError extends ServerError {
    constructor(resource, action) {
        super(
            'Permission Error',
            `You do not have permission to ${action} the ${resource}.`,
            `The client does not have the required permissions to ${action} the ${resource}.`,
            statusCode || 403
        );

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = PermissionError;
