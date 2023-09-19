const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');


const publicDir = path.join(appRoot.toString(), 'front');
const indexPath = path.join(publicDir, 'chat', 'chat');

const chatRouter = express.Router();

chatRouter.use(express.static(publicDir));
chatRouter.use(express.static(path.join(publicDir, 'chat')));
chatRouter.get('/', (req, res, next) => {
    try {
        res.status(200).render('chat/chat', req.query); // TODO...
    }
    catch (err) {
        return res.status(404).json({ error: 'Page Not Found' });
    }
});

module.exports = chatRouter;