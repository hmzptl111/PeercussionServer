const express = require('express');
const app = express();

const fs = require('fs');

const User = require('../models/user');

const isAuth = require('../auth/isAuth');

app.post('', isAuth, (req, res) => {
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        fs.unlink(`./uploads/profilePictures/${user.profilePicture}`, async (err) => {
            if(err) {
                if(err.code === 'ENOENT') {
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

            user.profilePicture = undefined;
            await user.save();
            
            res.end();
        });
    });
});

module.exports = app;