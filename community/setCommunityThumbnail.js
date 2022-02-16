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
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(!community) {
            res.json({
                error: 'Community does not exist'
            });
            res.end();
            return;
        }

        const isModerator = community.mId.toString() === uId;
            if(!isModerator) {
                res.json({
                    error: 'Unauthentic request, you are not the moderator'
                });
                res.end();
                return;
            }

            if(community.cThumbnail) {
                console.log(community.cThumbnail);
                fs.unlink(`./uploads/communityThumbnails/${community.cThumbnail}`, async (err) => {
                    if(err && err.code === 'ENOENT') {
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
    
            community.cThumbnail = req.file.filename;
            await community.save();
    
            res.end();
            return;
    });
});

module.exports = app;