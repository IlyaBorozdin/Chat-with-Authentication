const ClientError = require('./client');

class AuthError extends ClientError {
    constructor() {
        super(
            'Oops! We\'re having trouble with your login attempt. It appears that the authentication process couldn\'t be completed. Please ensure you\'ve entered the correct credentials and give it another shot. If you haven\'t signed up yet, consider registering to create an account. If you\'re still facing difficulties, don\'t hesitate to get in touch with our support team. We\'re here to help!',
            401
        );
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AuthError;