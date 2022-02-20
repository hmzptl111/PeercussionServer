const express = require('express');
const app = express.Router();
require('dotenv').config();

const bcrypt = require('bcrypt');
const User = require('../models/user');

app.post('', (req, res) => {
    const {username, password} = req.body;

    if(username === '' || password === '') {
        res.json({
            error: 'Some or all the required fields are empty'
        });
        res.end();
        return;
    }

    User.findOne({
        //email can also be used to sign in
        $or: [
            {username: username},
            {email: username}
        ]
    }, async (err, user) => {
        if(err) {
            res.json({
                error: `Something went wrong: ${err}`
            });
            res.end();
            return;
        }

        if(!user) {
            res.json({
                error: 'Username or email doesn\'t exist'
            })
            res.end();
            return;
        }

        if(!user.isEmailValidated) {
            res.json({
                error: 'To sign in, you must verify your email account. A verification email has been sent to you, please check your inbox'
            });
            res.end();
            return;
        }

        const response = await bcrypt.compare(password, user.password);
        if(!response) {
            res.json({
                error: 'Username or password incorrect'
            });
            res.end();
            return;
        }

        req.session.isAuth = true;
        req.session.uId = user._id.toString();
        req.session.uName = user.username;
        // res.cookie('uId', user._id.toString(), {maxAge: 1000 * 60 * 60 * 24 * 7});
        // res.cookie('uName', user.username, {maxAge: 1000 * 60 * 60 * 24 * 7});
        console.log(req.session);
        res.json({
            message: `Hello, ${user.username}. Welcome back to Peercussion`,
            uId: req.session.uId.toString(),
            uName: req.session.uName
        });
        res.end();
    });
})

module.exports = app;