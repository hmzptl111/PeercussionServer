const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');

const sendMail = require('../email/sendMail');

const User = require('../models/user');

app.post('', (req, res) => {
    const {username, password, email, about} = req.body;

    console.log('create account');

    if(username === '' || password === '' || email === '') {
        res.json({
            error: 'Some or all the required fields are empty'
        });
        res.end();
        return;
    }
    
    //if there's any non-word character(anything except [a-zA-Z0-9_]), username is invalid
    //if username starts with a digit like 3hamza, it is invalid
    const usernameRegex = /^[^\d][\w]+$/;
    if(!usernameRegex.test(username)) {
        res.json({
            error: 'Invalid username'
        });
        res.end();
        return;
    }

    const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*]).*$/;
    if(!passwordRegex.test(password)) {
        res.json({
            error: 'Invalid password'
        });
        res.end();
        return;
    }
    
    const emailRegex = /\S+@\S+\.\S+/;
    if(!emailRegex.test(email)) {
        res.json({
            error: 'Invalid email'
        });
        res.end();
        return;
    }

    User.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    }, async (err, user) => {
        if(err) {
            res.json({
                error: `Something went wrong: ${err}`
            });
            res.end();
            return;
        }
        if(user) {
            res.json({
                error: 'Username or email already in use'
            });
            res.end();
            return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const payload = {
            username,
            password: hashedPassword,
            email,
            about
        };

        const newUser = new User(payload);
        newUser.save()
        .then(result => {
            const {_id, email, username} = result;
            // sendMail(_id, email);

            res.json({
                message: `Hello ${username}, welcome to Peercussion. An email has been sent to your account, please verify your email to sign in.`
            });
            res.end();
            return;
        })
        .catch(err => {
            res.json({
                error: `Something went wrong: ${err}`
            });
            res.end();
            return;
        });
    });
});

module.exports = app;