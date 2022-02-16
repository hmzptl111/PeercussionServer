const express = require('express');
const app = express();

const Community = require('../models/community');
const User = require('../models/user');

const isAuth = require('../auth/isAuth');

app.post('', isAuth, (req, res) => {
    const {type, target, cancelFriendRequest} = req.body;
    const {uId} = req.session;

    if(uId === target) {
        res.json({
            error: 'Unfortunately, you cannot unfollow yourself, how nice?'
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

                const updatedCommunitiesFollowedByUser = user.followingCommunities.filter(c => (
                    c.toString() !== target
                ));
                user.followingCommunities = updatedCommunitiesFollowedByUser;
                community.followers -= 1;
                
                await community.save();
                await user.save();

                res.end();
                return;
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

                if(cancelFriendRequest) {
                    let hasUserAlreadyAcceptedRequest = user.friends.includes(target);
                    if(hasUserAlreadyAcceptedRequest) {
                        res.json({
                            message: 'request already accepted'
                        })
                        return;
                    }
                    
                    const updatedTargetUserFriendlist = targetUser.pendingFriendRequests.filter(u => {
                        u.toString() !== target
                    });
                    const updatedUserFriendlist = user.friendRequestsSent.filter(u => {
                        u.toString() !== target
                    });
                    
                    targetUser.pendingFriendRequests = updatedTargetUserFriendlist;
                    user.friendRequestsSent = updatedUserFriendlist;
                    
                    await targetUser.save();
                    await user.save();
        
                    res.end();
                    return;
                }
    
                const updatedTargetUserFriendlist = targetUser.friends.filter(u => {
                    u.toString() !== target
                });

                const updatedUserFriendlist = user.friends.filter(u => {
                    u.toString() !== target
                });
                
                targetUser.friends = updatedTargetUserFriendlist;
                user.friends = updatedUserFriendlist;

                await targetUser.save();
                await user.save();

                res.end();
                return;
            });
        }   
    });
});

module.exports = app;