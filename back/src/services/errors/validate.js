const ClientError = require("./client");

class ValidateError extends ClientError {
    constructor(suggestions) {
        super();
        this.suggestions = suggestions || [];
        Error.captureStackTrace(this, this.constructor);
    }

    push(suggestion) {
        this.suggestions.push(suggestion);
    }

    get isVerified() {
        return this.suggestions.length === 0;
    }
}

module.exports = ValidateError;