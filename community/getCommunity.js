const express = require('express');
const app = express.Router();
const Community = require('../models/community');

app.post('/:communityName', (req, res) => {
    const c = req.params.communityName;
    console.log(req.query.postOffset);
    
    if(req.query.fetchPostIDs === 'true' && req.query.postOffset) {
        Community.findOne({
            name: {
                $eq: c
            }
        },
        {
            posts: {
                $slice: [Number(req.query.postOffset), 3]
            }
        },
        (err, posts) => {
            if(err) {
                console.log(err);
                res.end();
            } else {
                console.log(posts.posts);
                res.end(JSON.stringify(posts.posts));
            }
        })
        .select('-_id -name -desc -followers -upvotes -downvotes -relatedCommunities -createdAt -updatedAt -__v');
    } else {
        Community.findOne({
            name: {
                $eq: c
            }
        },
        async (err, result) => {
            if(err) {
                console.log(err);
                res.end();
            } else {
                res.end(JSON.stringify(result));
            }
        }).select('-posts');
    }
});

module.exports = app;