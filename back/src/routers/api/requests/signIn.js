const SignInUser = require('../../../services/users/signInUser');

const signInHandler = (req, res, next) => {
    const user = new SignInUser(req.body);

    return user.signIn()
        .then((token) => {
            res.cookie('refreshToken', token.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
                httpOnly: true
            });
            return res.status(200).json(token);
        })
        .catch((err) => {
            return next(err);
        })
};

module.exports = signInHandler;