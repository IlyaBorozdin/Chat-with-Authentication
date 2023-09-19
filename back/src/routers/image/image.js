const express = require('express');
const { upload, handler } = require('./upload');
const download = require('./download');

const imageRouter = express.Router();

imageRouter.post('/image', upload.single('image'), handler);
imageRouter.get('/image', download);

module.exports = imageRouter;