const fs = require('fs').promises;
const path = require('path');
const appRoot = require('app-root-path');
const mime = require('mime-types');
const NotFoundError = require('../../services/errors/notFound');

const download = (req, res, next) => {
    const imageName = req.query.name;
    const contentType = mime.contentType(path.extname(imageName));
    const filePath = path.join(appRoot.toString(), 'img', imageName);

    fs.readFile(filePath)
        .then((data) => {
            res.set('Content-Type', contentType);
            res.set('Content-Length', data.length);
            res.status(200);
            res.send(data);
        })
        .catch(err => {
            return next(new NotFoundError('Image Not Found', `image ${imageName}`));
        });
};

module.exports = download;