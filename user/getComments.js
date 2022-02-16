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
            res.json({
                error: err
            });
            res.end();
            return;
        }
        
        if(!user) {
            res.json({
                error: 'User does not exist'
            });
            res.end();
            return;
        }

        res.json({
            message: user.comments
        });
        res.end();
        return;
    })
});

module.exports = app;