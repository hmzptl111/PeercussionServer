const express = require('express');
const app = express.Router();

const isAuth = require('../auth/isAuth');

const mongoose = require('mongoose');

const Community = require('../models/community');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

app.post('/', isAuth, async (req, res) => {
    const {action, pId, pCName, pUName, cName, body, field, schema, isAccountPrivate} = req.body;
    const {uId} = req.session;
    
    if(schema === 'community') {
        Community.findOne({
            cName: cName
        })
        .exec(async (err, community) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
    
            if(!community) {
                res.json({
                    error: 'Community does not exist'
                });
                res.end();
                return;
            }

            if(community.mId === uId) {
                res.json({
                    error: 'Unauthentic request'
                });
                res.end();
                return;
            }
    
            if(field === 'relatedCommunities') {
                if(action === 'remove') {
                    let previousRelatedCommunities = community.relatedCommunities;

                    let updatedRelatedCommunities = previousRelatedCommunities.filter(rc => {
                        return rc.toString() !== body;
                    });
                    console.log(updatedRelatedCommunities);
                    community.relatedCommunities = updatedRelatedCommunities;
                } else {
                    let previousRelatedCommunities = community.relatedCommunities;
                    previousRelatedCommunities.push(mongoose.Types.ObjectId(body));
                    community.relatedCommunities = previousRelatedCommunities;
                }
            } else {
                community[field] = body;
            }
            await community.save();
    
            res.json({
                message: 'Updated successfully'
            });
            res.end();
            return;
        });
    } else if(schema === 'user') {
        User.findOne({
            _id: uId
        })
        .exec(async (err, user) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }

            user[field] = body;

            await user.save();
            res.json({
                message: 'Updated successfully'
            });
            res.end();
            return;
        });
    } else if(schema === 'post') {
        try {
            await Post.deleteOne({
                _id: pId
            });
        } catch(err) {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
        }

        Community.findOne({
            cName: pCName
        })
        .exec(async (err, community) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
            
            const updatedCommunityPosts = community.posts.filter(p => p.toString() !== pId);
            community.posts = updatedCommunityPosts;
            await community.save();
        });

        User.findOne({
            username: pUName
        })
        .exec(async (err, user) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
            
            const updatedUserPosts = user.posts.filter(p => p.toString() !== pId);
            user.posts = updatedUserPosts;
            await user.save();
        });

        try {
            await Comment.deleteMany({
                pId: pId
            });
        } catch(err) {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
        }

        res.json({
            message: 'Post deleted successfully'
        });
        res.end();
        return;
    }
});

module.exports = app;