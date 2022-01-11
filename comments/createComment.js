const express = require('express');
const app = express.Router();

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

app.post('', (req, res) => {
    console.log('creating comment');
    const {pId, uId, uName, comment, replyTo} = req.body;
    
    User.findOne({
        _id: uId
    }, (err, user) => {
        if(err) {
            console.log('Something went wrong');
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }
        console.log(replyTo);
        const payload = {
            pId: pId,
            uId: uId,
            uName: uName,
            comment: comment,
            replyTo: replyTo
        }
        
        const newComment = new Comment(payload);
        newComment.save()
        .then(comment => {
            console.log(comment);
            if(replyTo !== undefined) {
                Comment.findOne({
                    _id: replyTo
                }, (err, replyToComment) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    if(!replyToComment) {
                        console.log('Comment doesn\'t exist');
                        return;
                    }
                    replyToComment.replies.push(comment._id);
                    user.comments.push(comment._id);
                    replyToComment.save();
                    user.save();
                });
                res.end(JSON.stringify(comment));
                return;
            }
            Post.findOne({
                _id: pId
            }, (err, post) => {
                if(err) {
                    console.log('Something went wrong');
                    return;
                }
                if(!post) {
                    console.log('Post doesn\'t exist');
                    return;
                }
                post.comments.push(comment._id);
                user.comments.push(comment._id);
                post.save();
                user.save();
                
                res.end(JSON.stringify(comment));
            });
        })
        .catch(err => {
            console.log(err);
            return;
        });
    });
});

module.exports = app;