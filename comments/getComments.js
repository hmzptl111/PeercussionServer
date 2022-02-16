const express = require('express');
const app = express.Router();

const Post = require('../models/post');
const Comment = require('../models/comment');

app.post('', (req, res) => {
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

            res.json({
                message: comment.replies
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
                limit: 3,
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
            
            res.json({
                message: post.comments
            });
            res.end();
            return;
        });
    }
});

module.exports = app;