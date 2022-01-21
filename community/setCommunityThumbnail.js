const express = require('express');
const app = express();
const fs = require('fs');

const isAuth = require('../auth/isAuth');

const multer = require('multer');

const uuidv4 = require('uuid').v4;

const Community = require('../models/community');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/communityThumbnails');
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

app.post('', isAuth, upload.single('communityThumbnail'), (req, res) => {
    const {uId} = req.session;
    const {cName} = req.body;

    Community.findOne({
        cName: cName
    })
    .exec(async (err, community) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!community) {
            console.log('Community doesn\'t exist');
            return;
        }

        const isModerator = community.mId.toString() === uId;
            if(!isModerator) {
                console.log('Only moderators can update community thumbnail');
                return;
            }

            if(community.cThumbnail) {
                console.log(community.cThumbnail);
                fs.unlink(`./uploads/communityThumbnails/${community.cThumbnail}`, async (err) => {
                    if(err && err.code == 'ENOENT') {
                        console.info('File doesn\'t exist');
                        return;
                    } else if (err) {
                        console.log(`Something went wrong: ${err}`);
                        return;
                    } 
                });
            }
    
            community.cThumbnail = req.file.filename;
            await community.save();
    
            res.end(JSON.stringify({
                message: 'Community thumbnail updated'
            }));
            return;
    });
});

module.exports = app;