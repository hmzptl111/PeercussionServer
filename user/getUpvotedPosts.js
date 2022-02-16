const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    const {uName, postsOffset} = req.body;

    User.findOne({
        username: uName
    })
    .select('-_id upvotedPosts')
    .populate({
        path: 'upvotedPosts',
        options: {
            limit: 3,
            skip: postsOffset
        },
        select: 'uId uName cId cName title upvotes downvotes totalComments thumbnail'
    })
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
            message: user.upvotedPosts
        });
        res.end();
        return;
    });
});

module.exports = app;