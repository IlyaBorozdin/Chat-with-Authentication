const ValidateError = require('../../../services/errors/validate');

const signUpValidate = (req, res, next) => {
    const { name, email, password, confirmPassword } = Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => [key, value.trim()])
    );
    const validateError = new ValidateError();
    const suggestion = {
        name: 'The name is too short, it must be at least three characters long.',
        email: 'Invalid email entered.',
        password: 'The password is too short, it must be at least eight characters long.',
        confirmPassword: 'Sorry, but the password and confirm password fields do not match. Please make sure you enter the same password in both fields.'
    };

    if (name.length < 3) {
        validateError.push(suggestion.name);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        validateError.push(suggestion.email);
    }
    if (password.length < 8) {
        validateError.push(suggestion.password);
    }
    if (password !== confirmPassword) {
        validateError.push(suggestion.confirmPassword);
    }
    if (validateError.isVerified) {
        return next();
    }

    return next(validateError);
}

module.exports = signUpValidate;