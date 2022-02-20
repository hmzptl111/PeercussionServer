const express = require('express');
const app = express.Router();

const User = require('../models/user');
const Post = require('../models/post');

app.post('/:pId', (req, res) => {
    const {pId} = req.params;
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .select('-_id upvotedPosts downvotedPosts')
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        
        Post.findOne({
            _id: req.params.pId
        }, (err, fetchedPost) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
            
            if(!fetchedPost) {
                res.json({
                    error: 'Could not find post'
                });
                res.end();
                return;
            }

            // let posts = JSON.parse(JSON.stringify(post));
            // for(let i = 0; i < posts.length; i++) {
            //     if(user && user.upvotedPosts.toString().includes(posts[i]._id.toString())) {
            //         posts[i].isUpvoted = true;
            //     } else if(user && user.downvotedPosts.toString().includes(posts[i]._id.toString())) {
            //         posts[i].isDownvoted = true;
            //     } else {
            //         posts[i].isUpvoted = false;
            //         posts[i].isDownvoted = false;
            //     }
            // }

            let post = JSON.parse(JSON.stringify(fetchedPost));
            if(user && user.upvotedPosts.toString().includes(post._id.toString())) {
                post.isUpvoted = true;
            } else if(user && user.downvotedPosts.toString().includes(post._id.toString())) {
                post.isDownvoted = true;
            } else {
                post.isUpvoted = false;
                post.isDownvoted = false;
            }

            res.json({
                message: post
            });
            res.end();
            return;
        }).select('-comments');
    });

});

module.exports = app;