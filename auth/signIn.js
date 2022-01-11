const express = require('express');
const app = express.Router();
require('dotenv').config();

const bcrypt = require('bcrypt');
const User = require('../models/user');

app.post('', (req, res) => {
    const {username, password} = req.body;

    if(username === '' || password === '') {
        res.status(400);
        res.end(JSON.stringify({
            error: 'Necessary information not provided for signing in'
        }));
    }

    User.findOne({
        //email can also be used to sign in
        $or: [
            {username: username},
            {email: username}
        ]
    }, async (err, user) => {
        if(err) {
            res.status(400);
            res.end(JSON.stringify({
                error: `Something went wrong: ${err}`
            }));
        }

        if(user) {
            console.log('---');
            console.log(user);
            console.log('---');
            const response = await bcrypt.compare(password, user.password);
            if(response) {
                req.session.isAuth = true;
                req.session.uId = user._id.toString();
                req.session.uName = user.username;
                // req.session.save();
                res.cookie('uId', user._id.toString(), {maxAge: 1000 * 60 * 60 * 24 * 7});
                res.cookie('uName', user.username, {maxAge: 1000 * 60 * 60 * 24 * 7});
                res.end(JSON.stringify({
                    message: `Welcome, ${user.username}`
                }));
                console.log(req.session);
            }
            else {
                res.status(400);
                res.end(JSON.stringify({
                    error: 'Incorrect password'
                })); 
            }
        } else {
            res.status(400);
            res.end(JSON.stringify({
                error: 'Username doesn\'t exist'
            }))
        }
    });
})

module.exports = app;