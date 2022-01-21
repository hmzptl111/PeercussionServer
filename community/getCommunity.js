const express = require('express');
const app = express.Router();

const Community = require('../models/community');

app.post('/:communityName', (req, res) => {
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
});

module.exports = app;