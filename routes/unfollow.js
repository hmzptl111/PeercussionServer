const express = require('express');
const app = express();

const Community = require('../models/community');
const User = require('../models/user');

app.post('', (req, res) => {
    const {type, target, cancelFriendRequest} = req.body;
    const {uId} = req.session;

    if(uId === target) return;

    User.findOne({
        _id: uId
    })
    .exec(async (err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        if(type === 'community') {
            Community.findOne({
                _id: target
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

                const updatedCommunitiesFollowedByUser = user.followingCommunities.filter(c => (
                    c.toString() !== target
                ));
                user.followingCommunities = updatedCommunitiesFollowedByUser;
                community.followers -= 1;
                
                await community.save();
                await user.save();

                res.end(JSON.stringify({
                    message: 'Community unfollowed'
                }));
            });
        } else if(type === 'user') {
            User.findOne({
                _id: target
            })
            .exec(async (err, targetUser) => {
                if(err) {
                    console.log(`Something went wrong: ${err}`);
                    return;
                }
                if(!targetUser) {
                    console.log('User doesn\'t exist');
                    return;
                }

                if(cancelFriendRequest) {
                    let hasUserAlreadyAcceptedRequest = user.friends.includes(target);
                    if(hasUserAlreadyAcceptedRequest) {
                        res.end(JSON.stringify({
                            message: 'User has accepted your friend request'
                        }));
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
        
                    res.end(JSON.stringify({
                        message: 'Cancelled friend request'
                    }));
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

                res.end(JSON.stringify({
                    message: 'Unfriended'
                }));
                return;
            });
        }   
    });
});

module.exports = app;