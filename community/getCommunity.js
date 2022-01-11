const express = require('express');
const app = express.Router();
const Community = require('../models/community');

app.post('/:communityName', (req, res) => {
    if(req.body.getPosts === 'affirmative') {
        Community.findOne({
            cName: req.params.communityName
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
            if(community) {
                // console.log(community.posts.length);
                if(community.posts.length < 3) {
                    // community.hasMorePosts = false;
                    console.log('no more posts available');
                }
                res.end(JSON.stringify(community.posts));
                return;
            }
        });
    } else {
        Community.findOne({
            cName: req.params.communityName
        })
        .select('-posts')
        .exec((err, community) => {
            if(err) {
                console.log(err);
                res.status(400);
                res.end(JSON.stringify({
                    error: `Something went wrong: ${err}`
                }));
                return;
            }
            // console.log(community);
            res.end(JSON.stringify(community));
        });
    }
});

module.exports = app;