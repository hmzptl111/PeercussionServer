const express = require('express');
const app = express();

const User = require('../models/user');

const isAuth = require('../auth/isAuth');

app.use('', isAuth, (req, res) => {
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .populate('pendingFriendRequests', 'username')
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        // res.end(JSON.stringify(user.pendingFriendRequests));
        res.json({
            message: user.pendingFriendRequests
        });
        res.end();
        return;
    });
});

module.exports = app;