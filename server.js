'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const appRoot = require('app-root-path');

const shutdown = require('./back/src/shutdown');
const loggerHandler = require('./back/src/middlewares/logger/handler');
const apiRouter = require('./back/src/routers/api/api');
const NotFoundError = require('./back/src/services/errors/notFound');
const errorHandlerConv = require('./back/src/middlewares/error/handlerConv');
const errorHandlerJSON = require('./back/src/middlewares/error/handlerJSON');
const imageRouter = require('./back/src/routers/image/image');
const wsRouter = require('./back/src/routers/ws/ws');
const authentication = require('./back/src/middlewares/authentication');
const spaRouter = require('./back/src/routers/spa/spa');
const accessRouter = require('./back/src/routers/access/access');

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(loggerHandler);

app.use('/', spaRouter);
app.use('/access', accessRouter);
app.use('/api', apiRouter);
app.use('/', imageRouter);
app.get('/connection', authentication, (req, res, next) => {
    wsRouter(app);
    res.status(200).json({ connection: true });
});

app.use((req, res, next) => {
    return next(new NotFoundError('Not Found', req.url));
});
app.use(errorHandlerConv);
app.use(errorHandlerJSON);

const keyPath = path.join(appRoot.toString(), 'certificates', 'localhost.key');
const certPath = path.join(appRoot.toString(), 'certificates', 'localhost.crt');

Promise.all([
    fs.readFile(keyPath, 'utf8'),
    fs.readFile(certPath, 'utf8')
])
    .then(([keyData, certData]) => {
        const options = { key: keyData, cert: certData };

        const port = process.env.PORT || 443;

        const server = https.createServer(options, app);

        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log('Use, for example: https://localhost:443');
        });

        shutdown(server);
    })
    .catch(err => {
        console.error('Failed to start server', err);
    });