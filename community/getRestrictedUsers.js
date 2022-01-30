const express = require('express');
const app = express.Router();

const Community = require('../models/community');

app.post('', (req, res) => {
    const {cName} = req.body;
    
    Community.findOne({
        cName: cName
    })
    .populate('restrictedUsers', 'username')
    .exec((err, community) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!community) {
            console.log('Community doesn\'t exist');
            return;
        }

        res.end(JSON.stringify(community.restrictedUsers));
    });
});

module.exports = app;