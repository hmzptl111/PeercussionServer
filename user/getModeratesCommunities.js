const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    const {uName} = req.body;
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .populate('moderatesCommunities', 'cName')
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(uName === req.session.uName) {
            res.json({
                message: user.moderatesCommunities
            });
            res.end();
            return;
        }

        User.findOne({
            username: uName
        })
        .populate('moderatesCommunities', 'cName')
        .exec((err, targetUser) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
            
            if(!targetUser) {
                res.json({
                    error: 'User does not exist'
                });
                res.end();
                return;
            }
            
            let communities = [];
            targetUser.moderatesCommunities.forEach(c => {
                let community = {
                    cId: c._id,
                    cName: c.cName,
                    isFollowing: 'no'
                };
                console.log(c);
                if(user && user.followingCommunities.includes(c._id)) {
                    community.isFollowing = 'yes';
                }

                communities.push(community);
            });

            res.json({
                message: communities
            });
            res.end();
            return;
        });
    })
});

module.exports = app;