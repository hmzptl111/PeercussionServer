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
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        if(uName === req.session.uName) {
            res.end(JSON.stringify(user.moderatesCommunities));
            return;
        }

        User.findOne({
            username: uName
        })
        .populate('moderatesCommunities', 'cName')
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
            targetUser.moderatesCommunities.forEach(c => {
                let community = {
                    cId: c._id,
                    cName: c.cName,
                    isFollowing: 'no'
                };
                console.log(c);
                if(user.followingCommunities.includes(c._id)) {
                    community.isFollowing = 'yes';
                }

                communities.push(community);
            });

            res.end(JSON.stringify(communities));
        });
    })
});

module.exports = app;