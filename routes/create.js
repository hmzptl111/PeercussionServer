const express = require('express');
const app = express.Router();

const Post = require('../models/post');
const Community = require('../models/community');
const User = require('../models/user');

const isAuth = require('../auth/isAuth');

const containsSpecialChar = str => {
    const pattern = /\W/g;
    return pattern.test(str);
}

app.post('/:type', isAuth, async (req, res) => {
    if(req.params.type === 'post') {
        const {uId, uName} = req.session;
        const {cId, cName, title, body} = req.body;

        if(title === '') {
            res.json({
                error: 'Post title cannot be empty'
            });
            res.end();
            return;
        }

        if(cId === '') {
            res.json({
                error: 'Please choose a valid community to post'
            });
            res.end();
            return;
        }

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

        Community.findOne({
            _id: cId
        })
        .exec((err, community) => {
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

            const thumbnail = req.body.body.blocks && req.body.body.blocks.find(block => block.type === 'image');
            let payload = {
                uId: uId,
                uName: uName,
                cId: cId,
                cName: cName,
                title: title,
                body: body,
                thumbnail: thumbnail && thumbnail.data.file.url
            }

            const post = new Post(payload)
            post.save()
            .then(async (newPost) => {
                let newCommunityPosts = community.posts;
                let newUserPosts = user.posts;

                newCommunityPosts.unshift(newPost._id);
                newUserPosts.unshift(newPost._id);
                community.posts = newCommunityPosts;
                user.posts = newUserPosts;

                await community.save();
                await user.save();
                res.json({
                    message: newPost._id
                });
                res.end();
                return;
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
    } else if(req.params.type === 'community') {
        const {cName, desc, relatedCommunities} = req.body;
        const {uId, uName} = req.session;

        if(cName === '') {
            // res.status(400);
            // res.end('Community name can\'t be empty');
            res.json({
                error: 'Community name cannot be empty'
            });
            res.end();
            return;
        }

        if(desc.length > 255) {
            res.json({
                error: 'Community description should not exceed 255 characters'
            });
            res.end();
            return;
        }

        const isInvalid = containsSpecialChar(cName);
        if(isInvalid) {
            // res.status(400);
            // res.end('Special characters aren\'t allowed');
            res.json({
                error: 'Special characters are invalid'
            });
            res.end();
            return;
        }

        User.findOne({
            _id: uId
        })
        .exec((err, user) => {
            if(err) {
                console.log(err);
                res.json({
                    error: err
                });
                res.end();
                return;
            }

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
                if(community) {
                    res.json({
                        error: 'Community name already in use'
                    });
                    res.end();
                    return;
                }
    
                const payload = {
                    mId: uId,
                    mName: uName,
                    cName: cName,
                    desc: desc,
                    relatedCommunities: relatedCommunities
                }
    
                const newCommunity = new Community(payload);
                newCommunity.save()
                .then(async (newCommunityResponse) => {
                    user.moderatesCommunities.push(newCommunityResponse._id);
                    await user.save();
                    res.json({
                        message: cName
                    });
                    res.end();
                    return;
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
        }
});

module.exports = app;