const express = require('express');
const app = express();

const Community = require('../models/community');
const User = require('../models/user');

app.post('/:type', (req, res) => {
    if(req.params.type === 'community') {
        console.log('community');
        Community.findOne({
            cName: req.body.communityName
        })
        .select('-_id posts')
        .populate({
            path: 'posts',
            options: {
                limit: 3,
                skip: req.body.postsOffset
            },
            select: '-body -comments -createdAt -updatedAt -__v'
        })
        .exec((err, community) => {
            if(err) {
                res.status(400);
                res.end(JSON.stringify({
                    error: `Something went wrong: ${err}`
                }));
                return;
            }
            if(!community) {
                console.log('Community doesn\'t exist');
                return;
            }
    
            if(community.posts.length < 3) {
                console.log('no more posts available');
            }
            res.end(JSON.stringify(community.posts));
            return;
        });
    } else if(req.params.type === 'user') {
        User.findOne({
            username: req.body.uName
        })
        .select('-_id posts')
        .populate({
            path: 'posts',
            options: {
                limit: 3,
                skip: req.body.postsOffset
            },
            select: 'uId uName cId cName title upvotes downvotes totalComments thumbnail'
        })
        .exec((err, user) => {
            if(err) {
                res.status(400);
                res.end(JSON.stringify({
                    error: `Something went wrong: ${err}`
                }));
                return;
            }
            if(!user) {
                console.log('Community doesn\'t exist');
                return;
            }
    
            if(user.posts.length < 3) {
                console.log('no more posts available');
            }
            res.end(JSON.stringify(user.posts));
            return;
        });
    }
});

module.exports = app;