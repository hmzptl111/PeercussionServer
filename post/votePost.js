const express = require('express');
const app = express();

const Post = require('../models/post');
const User = require('../models/user');

app.put('', (req, res) => {
    if(req.body.vote === 'upvote') {
        User
        .findOne({_id: req.session.uId})
        .select('upvotedPosts downvotedPosts')
        .exec((err, user) => {
            if(err) {
                console.log(err);
                return;
            }
            Post
            .findOne({_id: req.body.pId})
            .select('upvotes downvotes')
            .exec(async (err, post) => {
                let code;
                if(err) {
                    console.log(err);
                    return;
                }
                const isPostAlreadyUpvoted = user.upvotedPosts.some(pId => (
                    pId.toString() === req.body.pId
                ));
                if(!isPostAlreadyUpvoted) {
                    user.upvotedPosts.push(req.body.pId);
                    post.upvotes += 1;
                    
                    const isPostAlreadyDownvoted = user.downvotedPosts.some(pId => (
                        pId.toString() === req.body.pId
                    ));
                    code = 1;
                    if(isPostAlreadyDownvoted) {
                        const updatedDownvotedPosts = user.downvotedPosts.filter(pId => (
                            pId.toString() !== req.body.pId
                        ));
                        user.downvotedPosts = updatedDownvotedPosts;
                        post.downvotes -= 1;
                        code = 2;
                    }
                } else {
                    const updatedUpvotedPosts = user.upvotedPosts.filter(pId => (
                        pId.toString() !== req.body.pId
                    ));
                    user.upvotedPosts = updatedUpvotedPosts;
                    post.upvotes -= 1;
                    code = 3;
                }
                await user.save();
                await post.save();

                res.end(JSON.stringify({
                    code: code
                }));
                // res.end(JSON.stringify({
                //     message: 'Post upvoted'
                // }));
            });
        });
    } else if(req.body.vote === 'downvote') {
        User
        .findOne({_id: req.session.uId})
        .select('upvotedPosts downvotedPosts')
        .exec((err, user) => {
            if(err) {
                console.log(err);
                return;
            }
            Post
            .findOne({_id: req.body.pId})
            .select('upvotes downvotes')
            .exec(async (err, post) => {
                let code;
                if(err) {
                    console.log(err);
                    return;
                }
                const isPostAlreadyDownvoted = user.downvotedPosts.some(pId => (
                    pId.toString() === req.body.pId
                ));
                if(!isPostAlreadyDownvoted) {
                    user.downvotedPosts.push(req.body.pId);
                    post.downvotes += 1;

                    const isPostAlreadyUpvoted = user.upvotedPosts.some(pId => (
                        pId.toString() === req.body.pId
                    ));
                    code = 4;
                    if(isPostAlreadyUpvoted) {
                        const updatedUpvotedPosts = user.upvotedPosts.filter(pId => (
                            pId.toString() !== req.body.pId
                        ));
                        user.upvotedPosts = updatedUpvotedPosts;    
                        post.upvotes -= 1;
                        code = 5;
                    }
                } else {
                    const updatedDownvotedPosts = user.downvotedPosts.filter(pId => (
                        pId.toString() !== req.body.pId
                    ));
                    user.downvotedPosts = updatedDownvotedPosts;
                    post.downvotes -= 1;
                    code = 6;
                }
                await user.save();
                await post.save();
                
                res.end(JSON.stringify({
                    code: code
                }));
                // res.end(JSON.stringify({
                //     message: 'Post downvoted'
                // }));
            });
        });
    }
});

module.exports = app;