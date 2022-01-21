const express = require('express');
const app = express();

const User = require('../models/user');

app.use('', (req, res) => {
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .populate('pendingFriendRequests', 'username')
    .exec((err, user) => {
        if(err) {
            console.log(`Something went wrong:; ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        console.log(user);
        res.end(JSON.stringify(user.pendingFriendRequests));
    });
});

module.exports = app;