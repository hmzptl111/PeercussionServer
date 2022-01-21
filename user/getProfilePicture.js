const express = require('express');
const app = express();

require('dotenv').config();

const User = require('../models/user');

app.post('', (req, res) => {
    const {uName} = req.body;
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .select('profilePicture')
    .exec((err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        if(user.username === uName) {
            res.end(JSON.stringify({
                url: user.profilePicture
            }));
            return;
        }

        User.findOne({
            username: uName
        })
        .select('profilePicture')
        .exec((err, targetUser) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!targetUser) {
                console.log('User doesn\'t exist');
                return;
            }
            
            if(!targetUser.profilePicture) {
                res.end(JSON.stringify({
                    message: 'No profile picture found'
                }));
            }

            res.end(JSON.stringify({
                // url: `${process.env.ROOT_URL}/uploads/profilePictures/${targetUser.profilePicture}`
                url: `/uploads/profilePictures/${targetUser.profilePicture}`
            }));
        });
    });
});

module.exports = app;