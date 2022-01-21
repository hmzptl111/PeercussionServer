const express = require('express');
const app = express();

const fs = require('fs');

const User = require('../models/user');

app.post('', (req, res) => {
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

        fs.unlink(`./uploads/profilePictures/${uName}.png`, async (err) => {
            if(err && err.code == 'ENOENT') {
                console.info('File doesn\'t exist');
                return;
            } else if (err) {
                console.log(`Something went wrong: ${err}`);
                return;
            } 

            user.profilePicture = undefined;
            await user.save();
            res.end(JSON.stringify({
                message: 'Profile picture removed'
            }));
        });
    });
});

module.exports = app;