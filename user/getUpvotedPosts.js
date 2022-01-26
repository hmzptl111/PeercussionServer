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
            res.status(400);
            res.end(JSON.stringify({
                error: `Something went wrong: ${err}`
            }));
            return;
        }
        if(!user) {
            console.log('Community doesn\'t exist');
            return;
        }

        if(user.upvotedPosts.length < 3) {
            console.log('no more posts available');
        }
        res.end(JSON.stringify(user.upvotedPosts));
        return;
    });
});

module.exports = app;