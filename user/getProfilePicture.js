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
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(user.username === uName) {
            res.json({
                message: user.profilePicture
            });
            res.end();
            return;
        }

        User.findOne({
            username: uName
        })
        .select('profilePicture')
        .exec((err, targetUser) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
            
            if(!targetUser.profilePicture) {
                res.json({
                    message: 'no pp found'
                });
                res.end();
                return;
            }

            res.json({
                message: targetUser.profilePicture
            });
            res.end();
            return;
        });
    });
});

module.exports = app;