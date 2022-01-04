const express = require('express');
const app = express.Router();
const bcrypt = require('bcrypt');
const axios = require('axios');

const User = require('../models/user');

app.post('', async (req, res) => {
    const {username, password, email} = req.body;

    if(username === '' || password === '' || email === '') {
        res.send(JSON.stringify({
            error: 'Necessary information not provided for account creation'
        }));
        return;
    }
    
    //if there's any non-word character(anything except [a-zA-Z0-9_]), username is invalid
    //if username starts with a digit like 3hamza, it is invalid
    const usernameRegex = /^[^\d][\w]+$/;
    if(!usernameRegex.test(username)) {
        res.send(JSON.stringify({
            error: 'Username must only consist of, lowercase characters; uppercase characters; digits; underscores and must not start with a digit'
        }));
        return;
    }


    //can't write a freaking regex for password, so just leaving as is, for now
    // const passwordRegex = ;
    // if(!passwordRegex.test(password)) {
    //     res.send(JSON.stringify({
    //         error: 'Password must contain at least one lowercase character, one uppercase character and one digit'
    //     }));
    // }
    
    //to actually validate user email, send a mail to the user entered mail
    const emailRegex = /\S+@\S+\.\S+/;
    if(!emailRegex.test(email)) {
        res.send(JSON.stringify({
            error: 'Invalid email'
        }));
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    User.findOne({
        username: username
        //no need to look for emails, they are set to unique in model
        // $or: [
        //     {username: username},
        //     {email: email}
        // ]
    }, (err, user) => {
        if(err) console.log(err);
        if(!user) {
            const payload = {
                username,
                password: hashedPassword,
                email
            };

            const user = new User(payload);
            user.save()
                .then(result => {
                    res.status(200);
                    res.send(JSON.stringify({
                        message: `Hello ${result.username}, welcome to Peercussion`
                    }));
                    return;
                })
                .catch(err => {
                    res.status(400);
                    res.send(JSON.stringify({
                        error: err
                    }));
                    return;
                })
        } else {
            // res.status(400);
            res.send(JSON.stringify({
                error: 'Username already taken'
            }));
            return;
        }
    });
});

module.exports = app;