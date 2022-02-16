const express = require('express');
const app = express();
const fs = require('fs');

const multer = require('multer');

const uuidv4 = require('uuid').v4;

const User = require('../models/user');

const isAuth = require('../auth/isAuth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profilePictures');
    },
    filename: (req, file, cb) => {
        const uuid = uuidv4();
        const ext = file.mimetype.split('/');
        cb(null, uuid + '.' + ext[1]);
    }
});

const imageFilters = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid image type, only PNG and JPEG are accepted'), false);
    }
}

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 10
    // },
    fileFilter: imageFilters
});

app.post('', isAuth, upload.single('profilePictureUsingLocalImage'), (req, res) => {
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .exec(async (err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(user.profilePicture) {
            fs.unlink(`./uploads/profilePictures/${user.profilePicture}`, async (err) => {
                if(err && err.code == 'ENOENT') {
                    res.json({
                        error: 'Image does not exist'
                    });
                    res.end();
                    return;
                } else if (err) {
                    res.json({
                        error: err
                    });
                    res.end();
                    return;
                } 
            });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        res.end();
        return;
    })
});

module.exports = app;