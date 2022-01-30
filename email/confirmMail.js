const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

app.get('/:token', (req, res) => {
    const {token} = req.params;

    const data = jwt.verify(token, process.env.EMAIL_SECRET);

    User.findOne({
        _id: data.uId
    })
    .select('isEmailValidated')
    .exec(async (err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        user.isEmailValidated = true;
        await user.save();

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`Your email has been validated, you may now <a href = 'http://localhost:3000/signin'>sign in</a>  to Peercussion`);
    });
});

module.exports = app;