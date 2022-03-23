const express = require('express');
const app = express.Router();
require('dotenv').config();

const User = require('../models/user');
const bcrypt = require('bcrypt');

const sendMail = require('../email/sendMail');

app.post('', (req, res) => {
    const {username} = req.body;

    if(username === '') {
        res.json({
            error: 'Some or all of the required fields are empty'
        });
        res.end();
        return;
    }

    User.findOne({
        $or: [
            {username: username},
            {email: username}
        ]
    })
    .exec(async (err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(!user) {
            res.json({
                error: 'Username or email does not exist'
            });
            res.end();
            return;
        }

        sendMail(username, user.email, 'Reset Password - Peercussion', 'resetPassword', 'Reset Password', true);

        console.log(user);
        console.log(username);
        res.json({
            message: 'An email has been sent to your account to reset password'
        });
        res.end();
        return;
    });
});

module.exports = app;