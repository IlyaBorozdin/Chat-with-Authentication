class ServerError extends Error {
    constructor(message, userMessage, developerMessage, statusCode) {
        super(message || 'Internal Server Error');

        this.userMessage = userMessage || 'We\'re sorry, but something went wrong while processing your request.Our technical team has been notified and is working to resolve the issue. Please try again later.';

        this.developerMessage = developerMessage || 'An unexpected internal server error occurred. The issue has been logged for investigation. This error is not related to a specific database operation.';

        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ServerError;