const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    const {uName} = req.body;
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

        User.findOne({
            username: uName
        })
        .populate('comments', ['pId', 'pTitle', 'cName', 'comment', 'upvotes', 'downvotes', 'updatedAt'])
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

            let comments = JSON.parse(JSON.stringify(targetUser.comments));
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
    });
});

module.exports = app;