const multer = require('multer');
const fs = require('fs');
const path = require('path');

exports.fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

exports.fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

exports.clearImage = filePath => {
    filePath = path.join(__dirname, './images', filePath);
    fs.unlink(filePath, err => console.log(err));
};
