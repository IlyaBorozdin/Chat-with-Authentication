const signOutValidate = (req, res, next) => {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
        return next();
    }

    return res.status(204).end();
}

module.exports = signOutValidate;