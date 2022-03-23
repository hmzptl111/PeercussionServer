const express = require('express');
const app = express.Router();
require('dotenv').config();

const isAuth = require('./isAuth');

const User = require('../models/user');
const bcrypt = require('bcrypt');

app.post('', isAuth, (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const {uId} = req.session;

    if(oldPassword === newPassword) {
        res.json({
            error: 'New password cannot be the same as old password'
        });
        res.end();
        return;
    }

    User.findOne({
        _id: uId
    })
    .exec(async (err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        console.log(user);
        console.log(oldPassword);
        console.log(newPassword);

        const response = await bcrypt.compare(oldPassword, user.password);
        if(!response) {
            res.json({
                error: 'Incorrect password'
            });
            res.end();
            return;
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        await user.save();

        res.json({
            message: 'Password changed successfully'
        });
        res.end();
        return;
    });
});

module.exports = app;