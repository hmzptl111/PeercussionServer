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
        console.log('creating a post');

        if(req.body.title === '') {
            res.status(400);
            res.end('Community name can\'t be empty');
            return;
        }

        User.findOne({
            _id: uId
        })
        .exec((err, user) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!user) {
                console.log('User doesn\'t exist');
                return;
            }

        Community.findOne({
            _id: cId
        })
        .exec((err, community) => {

            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!community) {
                console.log('Community doesn\'t exist');
                return;
            }

            if(community.cName !== cName) return;

            const thumbnail = req.body.body.blocks.find(block => block.type === 'image');
            let payload;

            if(thumbnail) {
                payload = {
                    uId: uId,
                    uName: uName,
                    cId: cId,
                    cName: cName,
                    title: title,
                    body: body,
                    thumbnail: thumbnail.data.file.url
                }
            } else {
                payload = {
                    uId: uId,
                    uName: uName,
                    cId: cId,
                    cName: cName,
                    title: title,
                    body: body
                }
            }

            const post = new Post(payload)
            post.save()
            .then(newPost => {
                Community.findOne({
                    _id: cId
                })
                .exec(async (err, community) => {
                    if(err) {
                        console.log(`Something went wrong: ${err}`);
                        return;
                    }
                    if(!community) {
                        console.log('Community doesn\'t exist');
                        return;
                    }
                    let newCommunityPosts = community.posts;
                    let newUserPosts = user.posts;

                    newCommunityPosts.unshift(newPost._id);
                    newUserPosts.unshift(newPost._id);
                    community.posts = newCommunityPosts;
                    user.posts = newUserPosts;

                    await community.save();
                    await user.save();
                    res.end(JSON.stringify({pId: newPost._id}));
                })
            })
            .catch(err => {
                console.log(`Something went wrong: ${err}`);
                return;
            })
        });
    });
    } else if(req.params.type === 'community') {
        const {cName, desc, relatedCommunities} = req.body;
        const {uId, uName} = req.session;

        console.log('creating a community');

        if(cName === '') {
            res.status(400);
            res.end('Community name can\'t be empty');
            return;
        }

        const isInvalid = containsSpecialChar(cName);
        if(isInvalid) {
            res.status(400);
            res.end('Special characters aren\'t allowed');
            return;
        }

        User.findOne({
            _id: uId
        })
        .exec((err, user) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!user) {
                console.log('User doesn\'t exist');
                return;
            }

            Community.findOne({
                cName: cName
            })
            .exec(async (err, community) => {
                if(err) {
                    console.log(`Something went wrong: ${err}`);
                    return;
                }
                if(community) {
                    console.log('Community already exists');
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
                    res.end(cName);
                })
                .catch(err => {
                    console.log(`Something went wrong: ${err}`);
                    return;
                });
            }); 
        });
        }
});

module.exports = app;