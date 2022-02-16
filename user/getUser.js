const express = require('express');
const app = express.Router();

const User = require('../models/user');

app.post('/:username', (req, res) => {
    const {username} = req.params;
    const {uId, uName} = req.session;
    const personalProfile = username === uName;

    let selectQuery;

    if(!personalProfile) {
        selectQuery = 'username comments about friends isAccountPrivate profilePicture moderatesCommunities';
    } else {
        selectQuery = '-password -email -posts -__v';
    }

    User.findOne({
        username: username
    })
    .select(selectQuery)
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }
        if(!user) {
            res.json({
                error: 'User does not exist'
            });
            res.end();
            return;
        }

        if(personalProfile) {
            res.json({
                message: user
            });
            res.end();
            return;
        }

        if(user.isAccountPrivate) {
            const isFriend = user.friends.includes(uId);
            if(!isFriend) {
                res.json({
                    error: {
                        _id: user._id,
                        message: 'This account is private'
                    }
                });
                res.end();
                return;
            }
        }

        res.json({
            message: user
        });
        res.end();
        return;
    });
    return;
});

module.exports = app;