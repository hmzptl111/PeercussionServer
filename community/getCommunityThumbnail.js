const express = require('express');
const app = express();

const Community = require('../models/community');

app.post('', (req, res) => {
    const {cName} = req.body;

    Community.findOne({
        cName: cName
    })
    .select('cThumbnail')
    .exec((err, community) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!community) {
            console.log('User doesn\'t exist');
            return;
        }

        res.end(JSON.stringify({
            url: community.cThumbnail
        }));
        return;
    });
});

module.exports = app;