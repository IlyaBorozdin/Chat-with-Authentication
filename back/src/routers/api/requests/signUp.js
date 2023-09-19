const SignUpUser = require('../../../services/users/signUpUser');

const signUpHandler = (req, res, next) => {
    const user = new SignUpUser(req.body);

    return user.signUp()
        .then((token) => {
            res.cookie('refreshToken', token.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
                httpOnly: true
            });
            return res.status(201).json(token);
        })
        .catch((err) => {
            return next(err);
        })
};

module.exports = signUpHandler;