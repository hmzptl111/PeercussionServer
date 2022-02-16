const express = require('express');
const app = express.Router();

const Post = require('../models/post');

app.post('/:pId', (req, res) => {
    Post.findOne({
        _id: req.params.pId
    }, (err, post) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(!post) {
            res.json({
                error: 'Could not find post'
            });
            res.end();
            return;
        }

        res.json({
            message: post
        });
        res.end();
        return;
    }).select('-comments');
});

module.exports = app;