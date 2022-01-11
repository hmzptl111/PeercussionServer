const express = require('express');
const app = express.Router();

const Post = require('../models/post');

app.post('/:pId', (req, res) => {
    Post.findOne({
        _id: req.params.pId
    }, (err, post) => {
        if(err) {
            console.log(err);
            res.status(400);
            res.end(JSON.stringify({
                error: 'Something went wrong'
            }));
        } else {
            if(post) {
                console.log(post);
                res.end(JSON.stringify(post));
            } else {
                res.status(400);
                res.end(JSON.stringify({
                    error: 'Couldn\'t find post'
                }));
            }
        }
    }).select('-comments');
});

module.exports = app;