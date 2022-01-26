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
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        User.findOne({
            username: uName
        })
        .populate('followingCommunities', 'cName')
        .exec((err, targetUser) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!targetUser) {
                console.log('User doesn\'t exist');
                return;
            }
            
            let communities = [];
            targetUser.followingCommunities.forEach(c => {
                let community = {
                    cId: c._id,
                    cName: c.cName
                };
                if(!user.moderatesCommunities.includes(c._id)) {
                    if(user.followingCommunities.includes(c._id)) {
                        community.isFollowing = 'yes';
                    } else {
                        community.isFollowing = 'no';
                    }
                }

                communities.push(community);
            });

            res.end(JSON.stringify(communities));
        });
    })
});

module.exports = app;