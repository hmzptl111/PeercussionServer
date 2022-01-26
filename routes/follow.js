const express = require('express');
const app = express();

const Community = require('../models/community');
const User = require('../models/user');

app.post('', (req, res) => {
    const {type, target} = req.body;
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

        if(user.moderatesCommunities.includes(target)) {
            console.log('Users can\'t follow/unfollow communities they moderate');
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


                user.followingCommunities.unshift(target);
                community.followers += 1;
                
                await community.save();
                await user.save();

                res.end(JSON.stringify({
                    message: 'Community followed'
                }));
            });
        } else if(type === 'user') {
            console.log(user.friends);

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

                user.friendRequestsSent.unshift(target);
                targetUser.pendingFriendRequests.unshift(uId);
    
                await targetUser.save();
                await user.save();
                
                res.end(JSON.stringify({
                    message: 'Request sent'
                }));
            });
        }
    });
});

module.exports = app;