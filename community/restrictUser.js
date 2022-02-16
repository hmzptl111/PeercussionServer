const express = require('express');
const app = express.Router();

const Community = require('../models/community');

const isAuth = require('../auth/isAuth');

app.post('/:action', isAuth, (req, res) => {
    const {uId} = req.session;
    const {action} = req.params;
    const {restrictUId, cName} = req.body;

    Community.findOne({
        cName: cName
    })
    .exec(async (err, community) => {
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

        if(community.mId.toString() !== uId) {
            res.json({
                error: 'Unauthentic request, only moderators can restrict/unrestrict users'
            });
            res.end();
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

        res.end();
    });
});

module.exports = app;