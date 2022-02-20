const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    const {uName, postsOffset} = req.body;
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .select('_id upvotedPosts downvotedPosts')
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

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
        .exec((err, targetUser) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
    
            if(!targetUser) {
                res.json({
                    error: 'User does not exist'
                });
                res.end();
                return;
            }

            let posts = JSON.parse(JSON.stringify(targetUser.upvotedPosts));
            for(let i = 0; i < posts.length; i++) {
                if(user && user.upvotedPosts.toString().includes(posts[i]._id.toString())) {
                    posts[i].isUpvoted = true;
                } else if(user && user.downvotedPosts.toString().includes(posts[i]._id.toString())) {
                    posts[i].isDownvoted = true;
                } else {
                    posts[i].isUpvoted = false;
                    posts[i].isDownvoted = false;
                }
            }
    
            res.json({
                message: posts
            });
            res.end();
            return;
        });

    });

});

module.exports = app;