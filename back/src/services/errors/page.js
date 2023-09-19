const ServerError = require('./server');

class PageError extends ServerError {
    constructor(message, pageUrl = '??') {
        super(
            message || 'Page Error',
            `We're sorry, but something went wrong while trying to access the page at ${pageUrl}. Our technical team has been notified and is working to resolve the issue. Please try again later.`,
            `An unexpected error occurred while processing the page at ${pageUrl}. The issue has been logged for investigation.`,
            503
        );

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = PageError;