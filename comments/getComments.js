const express = require('express');
const app = express.Router();

const Post = require('../models/post');
const Comment = require('../models/comment');

app.post('', (req, res) => {
    if(req.body.replyTo !== undefined) {
        console.log('replyTo');
        Comment.findOne({
            _id: req.body.replyTo
        })
        .populate('replies')
        .exec((err, comment) => {
            if(err) {
                console.log(err);
                return;
            }
            if(!comment) {
                console.log('Something went wrong');
                return;
            }
            console.log(comment.replies);
            res.end(JSON.stringify(comment.replies));
            return;
        });
    } else {
        console.log('no replyTo');
        console.log(req.body.pId);
        console.log(req.body.commentsOffset);
        Post.findOne({
            _id: req.body.pId
        })
        .select('-_id comments')
        .populate({
            path: 'comments',
            options: {
                limit: 3,
                skip: req.body.commentsOffset
            }
        })
        .exec((err, post) => {
            if(err) {
                console.log('Something went wrong');
                return;
            }
            console.log(post.comments);
            res.end(JSON.stringify(post.comments));
        });
    }
    // console.log(req.query.commentOffset);
    // if(req.query.from === 'post') {
    //     console.log('fetching comments from post');
    // } else if(req.query.from === 'user') {
    //     console.log('fetching comments from user profile');
    // }
});

module.exports = app;