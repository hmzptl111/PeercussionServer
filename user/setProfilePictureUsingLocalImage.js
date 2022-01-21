const express = require('express');
const app = express();
const fs = require('fs');

const multer = require('multer');

const uuidv4 = require('uuid').v4;

const User = require('../models/user');

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

app.post('', upload.single('profilePictureUsingLocalImage'), (req, res) => {
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .exec(async (err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        if(user.profilePicture) {
            console.log(user.profilePicture);
            fs.unlink(`./uploads/profilePictures/${user.profilePicture}`, async (err) => {
                if(err && err.code == 'ENOENT') {
                    console.info('File doesn\'t exist');
                    return;
                } else if (err) {
                    console.log(`Something went wrong: ${err}`);
                    return;
                } 
            });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        res.end(JSON.stringify({
            message: 'Profile picture updated'
        }));
        return;
    })
});

module.exports = app;