const express = require('express');
const app = express();

const fs = require('fs');

const uuidv4 = require('uuid').v4;

const User = require('../models/user');

const isAuth = require('../auth/isAuth');

app.post('', isAuth, (req, res) => {
    const {profilePicture} = req.body;
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .exec((err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            res.json({
                error: err
            });
            res.end();
            return;
        }

        const imageString = profilePicture.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(imageString, 'base64');
        
        if(user.profilePicture) {
            console.log(user.profilePicture);
            fs.unlink(`./uploads/profilePictures/${user.profilePicture}`, async (err) => {
                if(err) {
                    if(err.code == 'ENOENT') {
                        res.json({
                            error: 'Image does not exist'
                        });
                        res.end();
                        return;
                    }
                    res.json({
                        error: err
                    });
                    res.end();
                    return;
                }
            });
        }

        const uuid = uuidv4();
        fs.writeFile(`./uploads/profilePictures/${uuid}.jpeg`, imageBuffer, async (err, image) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }

            user.profilePicture = `${uuid}.jpeg`;
            await user.save();
            
            res.end();
        });
    });
});

module.exports = app;