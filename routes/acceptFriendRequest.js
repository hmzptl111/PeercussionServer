const express = require('express');
const app = express();

const User = require('../models/user');
const Chat = require('../models/room');


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
        .exec((err, targetUser) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!targetUser) {
                console.log('User doesn\'t exist');
                return;
            }

            const payload = {
                participants: [user._id, targetUser._id]
            }

            const newChat = new Chat(payload);
            newChat.save()
            .then(async (chat) => {
                user.rooms.push(chat);
                targetUser.rooms.push(chat);

                user.chatUsers.push(targetUser._id);
                targetUser.chatUsers.push(user._id);
                
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
            })
            .catch(err => {
                console.log(`Something went wrong: ${err}`);
                return;
            })
        });
    });
});

module.exports = app;