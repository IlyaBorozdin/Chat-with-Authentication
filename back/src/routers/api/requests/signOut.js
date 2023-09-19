const SignOutUser = require('../../../services/users/signOutUser');

const signOutHandler = (req, res, next) => {
    const user = new SignOutUser(req.cookies);

    user.signOut()
        .then(() => {
            res.clearCookie('refreshToken');
            return res.status(204).end();
        })
        .catch((err) => {
            console.error(err);
            return next(err);
        });
}

module.exports = signOutHandler;