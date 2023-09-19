const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');
const uuid = require('uuid');
const ClientError = require('../../services/errors/client');

const diskStorage = multer.diskStorage({
    destination: path.join(appRoot.toString(), 'img'),
    filename: (req, file, cd) => {
        const fileName = uuid.v4() + path.extname(file.originalname);
        cd(null, fileName);
    }
});

const upload = multer({
    storage: diskStorage,
    limits: {
        fileSize: 12 * 1024 * 1024
    },
    fileFilter: (req, file, cd) => {
        if (file.mimetype.startsWith('image')) {
            cd(null, true);
        } else {
            cd(new ClientError('The client sent a file that is not an image. Only image files (e.g., JPEG, PNG) are allowed.', 422), false);
        }
    }
});

const handler = (req, res, next) => {
    if (!req.file) {
        return next(new ClientError('The client did not upload any file. Please make sure to select and upload a file.'));
    }
    const imageName = req.file.filename;
    res.status(201).json({ imageName: imageName });
};

module.exports = {
    upload,
    handler
};