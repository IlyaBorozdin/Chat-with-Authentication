const RefreshUser = require('../../../services/refreshToken');

const refreshHandler = (req, res, next) => {
    const user = new RefreshUser(req.cookies);

    return user.refresh()
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
}

module.exports = refreshHandler;