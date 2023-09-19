const jwt = require('jsonwebtoken');
const util = require('util');

const AuthError = require('../services/errors/auth');

const verify = util.promisify(jwt.verify);

const authentication = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')?.[1];

    return verify(accessToken, process.env.JWT_ACCESS_KEY)
        .then((decoded) => {
            req.user = decoded;
            return next();
        })
        .catch((err) => {
            return next(new AuthError());
        })
};

module.exports = authentication;