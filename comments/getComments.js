const express = require('express');
const app = express.Router();

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

app.post('', (req, res) => {
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .select('-_id upvotedComments downvotedComments')
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(req.body.replyTo !== undefined) {
            const {replyTo} = req.body;
    
    
            Comment.findOne({
                _id: replyTo
            })
            .populate('replies')
            .exec((err, comment) => {
                if(err) {
                    res.json({
                        error: err
                    });
                    res.end();
                    return;
                }
    
                if(!comment) {
                    res.json({
                        error: 'Could not find comment'
                    });
                    res.end();
                    return;
                }

                let replies = JSON.parse(JSON.stringify(comment.replies));
                for(let i = 0; i < replies.length; i++) {
                    if(user && user.upvotedComments.toString().includes(replies[i]._id.toString())) {
                        replies[i].isUpvoted = true;
                    } else if(user && user.downvotedComments.toString().includes(replies[i]._id.toString())) {
                        replies[i].isDownvoted = true;
                    } else {
                        replies[i].isUpvoted = false;
                        replies[i].isDownvoted = false;
                    }
                }
    
                console.log('===');
                console.log(replies);
                console.log('===');

                res.json({
                    message: replies
                });
                res.end();
                return;
            });
        } else {
            const {pId, commentsOffset} = req.body;
    
            Post.findOne({
                _id: pId
            })
            .select('-_id comments')
            .populate({
                path: 'comments',
                options: {
                    limit: 20,
                    skip: commentsOffset
                }
            })
            .exec((err, post) => {
                if(err) {
                    res.json({
                        error: err
                    });
                    res.end();
                    return;
                }
                
                let comments = JSON.parse(JSON.stringify(post.comments));
                for(let i = 0; i < comments.length; i++) {
                    if(user && user.upvotedComments.toString().includes(comments[i]._id.toString())) {
                        comments[i].isUpvoted = true;
                    } else if(user && user.downvotedComments.toString().includes(comments[i]._id.toString())) {
                        comments[i].isDownvoted = true;
                    } else {
                        comments[i].isUpvoted = false;
                        comments[i].isDownvoted = false;
                    }
                }

                res.json({
                    message: comments
                });
                res.end();
                return;
            });
        }
    });
});

module.exports = app;