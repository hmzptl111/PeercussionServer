const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    console.log(global.socketConnections);
    if(global.socketConnections === []) return;

    const {uId} = req.session;

    if(!uId) {
        res.end();
        return;
    }

    User.findOne({
        _id: uId
    })
    .select('-_id chatUsers rooms')
    .populate('chatUsers')
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        let result = [];
        for(let i = 0; i < user.rooms.length; i++) {
            result[i] = {
                uId: user.chatUsers[i] && user.chatUsers[i]._id,
                uName: user.chatUsers[i] && user.chatUsers[i].username,
                uProfilePicture: user.chatUsers[i] && user.chatUsers[i].profilePicture,
                room: user.rooms[i],
                isUserOnline: global.socketConnections.includes(user.chatUsers[i] && user.chatUsers[i]._id.toString()) ? true : false
            };
        }

        res.json({
            message: result
        });
        res.end();
        return;
    })
});

module.exports = app;