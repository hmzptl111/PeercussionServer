const express = require('express');
const app = express();

const User = require('../models/user');
const Chat = require('../models/room');

const isAuth = require('../auth/isAuth');

app.post('', isAuth, (req, res) => {
    const {target} = req.body;
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
            _id: target
        })
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

            const payload = {
                participants: [user._id, targetUser._id]
            }

            const idList = [uId, targetUser._id];

            Chat.findOne({
                participants: {
                    $in: idList
                }
            })
            .exec(async (err, docs) => {
                if(err) {
                    res.json({
                        error: err
                    });
                    res.end();
                    return;
                }

                if(!docs) {
                    const newChatRoom = new Chat(payload);
                    newChatRoom.save()
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
            
                        res.end();
                    })
                    .catch(err => {
                        res.json({
                            error: err
                        });
                        res.end();
                        return;
                    });
                } else {
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
        
                    res.end();
                }
            });

            
        });
    });
});

module.exports = app;