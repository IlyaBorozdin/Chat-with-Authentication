const express = require('express');
const { upload, handler } = require('./upload');
const download = require('./download');
const authentication = require('../../middlewares/authentication');

const imageRouter = express.Router();

imageRouter.use(authentication);
imageRouter.post('/image', upload.single('image'), handler);
imageRouter.get('/image', download);

module.exports = imageRouter;