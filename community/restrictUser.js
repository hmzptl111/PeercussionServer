const express = require('express');
const app = express.Router();

const Community = require('../models/community');

app.post('/:action', (req, res) => {
    const {uId} = req.session;
    const {action} = req.params;
    const {restrictUId, cName} = req.body;

    Community.findOne({
        cName: cName
    })
    .exec(async (err, community) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!community) {
            console.log('Community doesn\'t exist');
            return;
        }
        if(community.mId.toString() !== uId) {
            res.status(401);
            res.end(JSON.stringify({
                message: 'Unauthentic request'
            }));
            return;
        }

        if(action === 'restrict') {
            community.restrictedUsers.push(restrictUId);
            await community.save();
        } else if(action === 'unrestrict') {
            const updatedRestrictedUsers = community.restrictedUsers.filter(u => u.toString() !== restrictUId);
            community.restrictedUsers = updatedRestrictedUsers;
            await community.save();
        }

        res.end(JSON.stringify({
            message: `User ${action === 'restrict' ? 'restricted': 'unrestricted'}`
        }));
    });
});

module.exports = app;