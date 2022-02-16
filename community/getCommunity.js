const express = require('express');
const app = express.Router();

const Community = require('../models/community');

app.post('/:communityName', (req, res) => {
    const {communityName} = req.params;
    const {uId} = req.session;

    Community.findOne({
        cName: communityName
    })
    .select('-posts')
    .exec((err, community) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(community.restrictedUsers.includes(uId)) {
            res.json({
                error: 'restricted'
            });
            res.end();
            return;
        }

        res.json({
            message: community
        });
        res.end();
        return;
    });
});

module.exports = app;