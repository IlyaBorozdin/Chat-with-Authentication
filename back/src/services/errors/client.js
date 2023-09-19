const ServerError = require('./server');

class ClientError extends ServerError {
    constructor(userMessage, statusCode) {
        super(
            'Client Error',
            userMessage || 'Oops! It seems there was an issue with your request. Please double-check the provided data and try again. If the problem persists, feel free to contact our support team.',
            'An unexpected client-related error occurred. This error might be due to invalid or insufficient data provided in the request. Please check the request payload and ensure it follows the expected format and requirements.',
            statusCode || 400
        );

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ClientError;