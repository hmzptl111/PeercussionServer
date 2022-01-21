const express = require('express');
const app = express();

const fs = require('fs');

const uuidv4 = require('uuid').v4;

const User = require('../models/user');

app.post('', (req, res) => {
    const {profilePicture} = req.body;
    const {uId, uName} = req.session;

    User.findOne({
        _id: uId
    })
    .exec((err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        const imageString = profilePicture.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(imageString, 'base64');
        
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

        const uuid = uuidv4();
        fs.writeFile(`./uploads/profilePictures/${uuid}.jpeg`, imageBuffer, async (err, image) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }

            user.profilePicture = `${uuid}.jpeg`;
            await user.save();
            
            res.end(JSON.stringify({
                message: 'Profile picture updated'
            }));
        });
    });
});

module.exports = app;