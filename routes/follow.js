const express = require('express');
const app = express();

const Community = require('../models/community');
const User = require('../models/user');

const isAuth = require('../auth/isAuth');

app.post('', isAuth, (req, res) => {
    const {type, target} = req.body;
    const {uId} = req.session;

    if(uId === target) {
        res.json({
            error: 'Unfortunately, you cannot follow yourself, how sad?'
        });
        res.end();
        return;
    }

    User.findOne({
        _id: uId
    })
    .exec(async (err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        if(user.moderatesCommunities.includes(target)) {
            res.json({
                error: 'Moderators cannot follow communities they moderate'
            });
            res.end();
            return;
        }

        if(type === 'community') {
            Community.findOne({
                _id: target
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


                user.followingCommunities.unshift(target);
                community.followers += 1;
                
                await community.save();
                await user.save();

                res.end();
            });
        } else if(type === 'user') {
            User.findOne({
                _id: target
            })
            .exec(async (err, targetUser) => {
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

                user.friendRequestsSent.unshift(target);
                targetUser.pendingFriendRequests.unshift(uId);
    
                await targetUser.save();
                await user.save();
                
                res.end();
            });
        }
    });
});

module.exports = app;