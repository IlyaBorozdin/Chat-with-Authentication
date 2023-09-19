const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');
const PageError = require('../../services/errors/page');

const publicDir = path.join(appRoot.toString(), 'front');
const indexPath = path.join(publicDir, 'main.html');

const spaRouter = express.Router();

spaRouter.use(express.static(publicDir));
spaRouter.use(express.static(path.join(publicDir, 'access')));
spaRouter.use(express.static(path.join(publicDir, 'chat')));

spaRouter.get('/', (req, res, next) => {
    try {
        return res.status(200).sendFile(indexPath);
    } catch (err) {
        console.error('Page not loaded:', err);
        return next(new PageError('Page Not Loaded', req.url));
    }
});

module.exports = spaRouter;