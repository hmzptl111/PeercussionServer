const express = require('express');
const app = express.Router();

const Post = require('../models/post');

app.post('/:pId', (req, res) => {
    Post.find({
        _id: req.params.pId
    }, (err, post) => {
        if(err) {
            console.log(err);
            res.end();
        } else {
            console.log(post[0]);
            res.end(JSON.stringify(post[0]));
        }
    });
});

module.exports = app;