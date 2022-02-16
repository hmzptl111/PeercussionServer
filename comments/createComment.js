const express = require('express');
const app = express.Router();

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const isAuth = require('../auth/isAuth');

app.post('', isAuth, (req, res) => {
    const {pId, pTitle, cId, cName, comment, replyTo} = req.body;
    const {uId, uName} = req.session;

    User.findOne({
        _id: uId
    })
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
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
                        res.json({
                            error: err
                        });
                        res.end();
                        return;
                    }

                    if(!replyToComment) {
                        res.json({
                            error: 'Comment does not exist'
                        });
                        res.end();
                        return;
                    }

                    replyToComment.replies.push(comment._id);
                    user.comments.push(comment._id);
                    
                    await replyToComment.save();
                    await user.save();

                    res.json({
                        message: comment
                    });
                    res.end();
                    return;
                });
            } else {
                Post.findOne({
                    _id: pId
                })
                .exec(async (err, post) => {
                    if(err) {
                        res.json({
                            error: err
                        });
                        res.end();
                        return;
                    }

                    if(!post) {
                        res.json({
                            error: 'Post does not exist'
                        });
                        res.end();
                        return;
                    }

                    post.totalComments += 1;
                    post.comments.push(comment._id);
                    user.comments.push(comment._id);

                    await post.save();
                    await user.save();
                    
                    res.json({
                        message: comment
                    });
                    res.end();
                    return;
                });
            }
        })
        .catch(err => {
            res.json({
                error: err
            });
            res.end();
            return;
        });
    });
});

module.exports = app;