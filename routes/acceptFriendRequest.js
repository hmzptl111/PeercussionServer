const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    const {target} = req.body;
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

            const updatedTargetUserFriendlist = targetUser.friendRequestsSent.filter(u => {
                u.toString() !== target
            });

            const updatedUserFriendlist = user.pendingFriendRequests.filter(u => {
                u.toString() !== uId
            });

            targetUser.friendRequestsSent = updatedTargetUserFriendlist;
            user.pendingFriendRequests = updatedUserFriendlist;

            user.friends.unshift(target);
            targetUser.friends.unshift(uId);

            await targetUser.save();
            await user.save();

            res.end(JSON.stringify({
                message: 'Friend request accepted'
            }));
        });
    });
});

module.exports = app;