const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    const {uName} = req.body;

    User.findOne({
        username: uName
    })
    .populate('comments', ['pId', 'pTitle', 'cName', 'comment', 'upvotes', 'downvotes', 'updatedAt'])
    .exec((err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        console.log(user);
        res.end(JSON.stringify(user.comments));
    })
});

module.exports = app;