const ServerError = require('./server');

class StorageError extends ServerError {
    constructor(operation, statusCode) {
        super(
            'Storage Error',
            'We\'re experiencing technical difficulties while processing your request.This issue is related to our database. Please try again later or contact support.',
            `An internal server error occurred during a database operation. The error happened while executing a ${operation || '??'} query. The issue has been logged for investigation.`,
            statusCode
        );

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = StorageError;