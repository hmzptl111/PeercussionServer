const express = require('express');
const app = express.Router();

const Community = require('../models/community');
const User = require('../models/user');

app.post('/:type', async (req, res) => {
    const {text} = req.body;
    const {type} = req.params;
    const {uId} = req.session;

    if(text === '') {
        res.end();
        return;
    }

    const pattern = /\W/g;
    const isInvalid = pattern.test(text);

    if(isInvalid) {
        res.json({
            error: 'Invalid input'
        });
        res.end();
        return;
    }

    if(type === 'community') {
        Community.find({
            cName: {
                $regex: new RegExp(text, 'ig')
            }
        })
        .limit(5)
        .select('cName cThumbnail')
        .exec((err, communities) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }

            res.json({
                message: communities
            });
            res.end();
            return;
        });
    } else if(type === 'user') {
        User.find({
            username: {
                $regex: new RegExp(text, 'ig')
            }
        })
        .limit(5)
        .select('username profilePicture')
        .exec((err, users) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
            
            const matchedUsers = users.filter(user => user._id.toString() !== uId);

            res.json({
                message: matchedUsers
            });
            res.end();
            return;
        });
    }
});

module.exports = app;