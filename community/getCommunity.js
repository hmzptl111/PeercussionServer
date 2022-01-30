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
            console.log(err);
            res.status(400);
            res.end(JSON.stringify({
                error: `Something went wrong: ${err}`
            }));
            return;
        }

        if(community.restrictedUsers.includes(uId)) {
            res.end(JSON.stringify({
                error: 'You are restricted from accessing this community'
            }));
            return;
        }

        res.end(JSON.stringify(community));
    });
});

module.exports = app;