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
            message: community.cThumbnail
        });
        res.end();
        return;
    });
});

module.exports = app;