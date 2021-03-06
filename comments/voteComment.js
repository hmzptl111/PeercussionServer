const express = require('express');
const app = express();

// const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const isAuth = require('../auth/isAuth');

app.put('', isAuth, (req, res) => {
    if(req.body.vote === 'upvote') {
        User
        .findOne({_id: req.session.uId})
        .select('upvotedComments downvotedComments')
        .exec((err, user) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
            Comment
            .findOne({_id: req.body.cId})
            .select('upvotes downvotes')
            .exec(async (err, comment) => {
                let code;
                if(err) {
                    res.json({
                        error: err
                    });
                    res.end();
                    return;
                }

                const isCommentAlreadyUpvoted = user.upvotedComments.some(cId => (
                    cId.toString() === req.body.cId
                ));
                if(!isCommentAlreadyUpvoted) {
                    user.upvotedComments.push(req.body.cId);
                    comment.upvotes += 1;
                    
                    const isCommentAlreadyDownvoted = user.downvotedComments.some(cId => (
                        cId.toString() === req.body.cId
                    ));
                    code = 1;
                    if(isCommentAlreadyDownvoted) {
                        const updatedDownvotedComments = user.downvotedComments.filter(cId => (
                            cId.toString() !== req.body.cId
                        ));
                        user.downvotedComments = updatedDownvotedComments;
                        comment.downvotes -= 1;
                        code = 2;
                    }
                } else {
                    const updatedUpvotedComments = user.upvotedComments.filter(cId => (
                        cId.toString() !== req.body.cId
                    ));
                    user.upvotedComments = updatedUpvotedComments;
                    comment.upvotes -= 1;
                    code = 3;
                }
                await user.save();
                await comment.save();

                res.json({
                    message: code
                });
                res.end();
                return;
            });
        });
    } else if(req.body.vote === 'downvote') {
        User
        .findOne({_id: req.session.uId})
        .select('upvotedComments downvotedComments')
        .exec((err, user) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }

            Comment
            .findOne({_id: req.body.cId})
            .select('upvotes downvotes')
            .exec(async (err, comment) => {
                let code;
                if(err) {
                    res.json({
                        error: err
                    });
                    res.end();
                    return;
                }
                const isCommentAlreadyDownvoted = user.downvotedComments.some(cId => (
                    cId.toString() === req.body.cId
                ));
                if(!isCommentAlreadyDownvoted) {
                    user.downvotedComments.push(req.body.cId);
                    comment.downvotes += 1;

                    const isCommentAlreadyUpvoted = user.upvotedComments.some(cId => (
                        cId.toString() === req.body.cId
                    ));
                    code = 4;
                    if(isCommentAlreadyUpvoted) {
                        const updatedUpvotedComments = user.upvotedComments.filter(cId => (
                            cId.toString() !== req.body.cId
                        ));
                        user.upvotedComments = updatedUpvotedComments;    
                        comment.upvotes -= 1;
                        code = 5;
                    }
                } else {
                    const updatedDownvotedComments = user.downvotedComments.filter(cId => (
                        cId.toString() !== req.body.cId
                    ));
                    user.downvotedComments = updatedDownvotedComments;
                    comment.downvotes -= 1;
                    code = 6;
                }
                await user.save();
                await comment.save();
                
                res.json({
                    message: code
                });
                res.end();
                return;
            });
        });
    }
});

module.exports = app;