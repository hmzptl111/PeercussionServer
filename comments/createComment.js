const express = require('express');
const app = express.Router();

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

app.post('', (req, res) => {
    console.log('creating comment');
    const {pId, pTitle, cId, cName, comment, replyTo} = req.body;
    const {uId, uName} = req.session;

    User.findOne({
        _id: uId
    })
    .exec((err, user) => {
        if(err) {
            console.log('Something went wrong');
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }
       
        const payload = {
            pId: pId,
            uId: uId,
            uName: uName,
            uProfilePicture: user.profilePicture,
            pTitle: pTitle,
            cId: cId,
            cName: cName,
            comment: comment,
            replyTo: replyTo
        }

        const newComment = new Comment(payload);
        newComment.save()
        .then(comment => {
            if(replyTo !== undefined) {
                Comment.findOne({
                    _id: replyTo
                })
                .exec(async (err, replyToComment) => {
                    if(err) {
                        console.log(`Something went wrong: ${err}`);
                        return;
                    }
                    if(!replyToComment) {
                        console.log('Comment doesn\'t exist');
                        return;
                    }
                    replyToComment.replies.push(comment._id);
                    user.comments.push(comment._id);
                    
                    await replyToComment.save();
                    await user.save();

                    res.end(JSON.stringify(comment));
                });
            } else {
                Post.findOne({
                    _id: pId
                })
                .exec(async (err, post) => {
                    if(err) {
                        console.log(`Something went wrong: ${err}`);
                        return;
                    }
                    if(!post) {
                        console.log('Post doesn\'t exist');
                        return;
                    }

                    post.totalComments += 1;
                    post.comments.push(comment._id);
                    user.comments.push(comment._id);
                    await post.save();
                    await user.save();
                    
                    res.end(JSON.stringify(comment));
                });
            }
        })
        .catch(err => {
            console.log(`Something went wrong: ${err}`);
            return;
        });
    });
});

module.exports = app;