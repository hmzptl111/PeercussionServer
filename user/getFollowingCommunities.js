const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    const {uName} = req.body;
    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        User.findOne({
            username: uName
        })
        .populate('followingCommunities', 'cName')
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
            targetUser.followingCommunities.forEach(c => {
                let community = {
                    cId: c._id,
                    cName: c.cName,
                    isFollowing: 'no'
                };
                if(user && !user.moderatesCommunities.includes(c._id)) {
                    if(user.followingCommunities.includes(c._id)) {
                        community.isFollowing = 'yes';
                    }
                }

                communities.push(community);
            });

            // res.end(JSON.stringify(communities));
            res.json({
                message: communities
            });
            res.end();
        });
    })
});

module.exports = app;