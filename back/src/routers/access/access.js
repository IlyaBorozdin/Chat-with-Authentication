const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');
const PageError = require('../../services/errors/page');

const publicDir = path.join(appRoot.toString(), 'front');
const indexPath = path.join(publicDir, 'access', 'signIn.html');

const accessRouter = express.Router();

accessRouter.use(express.static(publicDir));
accessRouter.use(express.static(path.join(publicDir, 'access')));
accessRouter.get('/', (req, res, next) => {
    try {
        return res.status(200).sendFile(indexPath);
    } catch (err) {
        console.error('Page not loaded:', err);
        return next(new PageError('Page Not Loaded', req.url));
    }
});

module.exports = accessRouter;