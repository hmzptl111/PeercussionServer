const express = require('express');
const app = express.Router();

const Community = require('../models/community');

app.post('', (req, res) => {
    const {cName} = req.body;
    
    Community.findOne({
        cName: cName
    })
    .populate('restrictedUsers', 'username profilePicture')
    .exec((err, community) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }
        if(!community) {
            res.json({
                error: 'Community does not exist'
            });
            res.end();
            return;
        }

        res.json({
            message: community.restrictedUsers
        });
        res.end();
    });
});

module.exports = app;