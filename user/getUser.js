const express = require('express');
const app = express.Router();

const User = require('../models/user');

app.post('/:username', (req, res) => {
    const {username} = req.params;
    const {uId, uName} = req.session;
    const personalProfile = username === uName;

    let selectQuery;

    if(!personalProfile) {
        selectQuery = 'username comments about friends isAccountPrivate profilePicture';
    } else {
        selectQuery = '-password -email -posts -__v';
    }

    User.findOne({
        username: username
    })
    .select(selectQuery)
    .exec((err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        if(personalProfile) {
            res.end(JSON.stringify(user));
            return;
        }

        if(user.isAccountPrivate) {
            const isFriend = user.friends.includes(uId);
            if(!isFriend) {
                res.end(JSON.stringify({
                    _id: user._id,
                    error: 'This account is private'
                }));
                return;
            }
        }

        res.end(JSON.stringify(user));
    });
    return;
});

module.exports = app;