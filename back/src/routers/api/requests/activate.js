const ActivateUser = require('../../../services/users/activateUser');

const activateHandler = (req, res, next) => {
    const user = new ActivateUser(req.params.link);

    return user.activate()
        .then(() => {
            return res.redirect(process.env.CLIENT_URL);
        })
        .catch((err) => {
            return next(err);
        })
}

module.exports = activateHandler;