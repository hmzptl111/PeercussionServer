const express = require('express');
const app = express.Router();
require('dotenv').config();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/:token', (req, res) => {
    const {token} = req.params;
    const {newPassword} = req.body;
    console.log(token);

    const data = jwt.verify(token, process.env.EMAIL_SECRET);

    console.log(data);

    User.findOne({
        $or: [
            {username: data.identifier},
            {email: data.identifier}
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
                error: 'User doesn\'t not exist'
            });
            res.end();
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({
            message: 'Password reset successful'
        });
        res.end();
        return;
    });
});

module.exports = app;