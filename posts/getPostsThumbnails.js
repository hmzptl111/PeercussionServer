const express = require('express');
const app = express.Router();

const Post = require('../models/post');

app.post('', (req, res) => {
    const postIDs = JSON.parse(req.query.postIDs)
    console.log(postIDs);

    Post.find({
        _id: {
            $in: postIDs
        }
    },
    (err, posts) => {
        if(err) {
            console.log(err);
        } else {
            console.log(posts);
            res.end(JSON.stringify(posts.reverse()));
        }
    }).select('cId title upvotes downvotes');
});

module.exports = app;