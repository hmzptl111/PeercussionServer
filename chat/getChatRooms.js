const express = require('express');
const app = express();

const isAuth = require('../auth/isAuth');

const User = require('../models/user');

// const socketConnections = require('../index');

app.post('', isAuth, (req, res) => {
    console.log(global.socketConnections);
    if(global.socketConnections === []) return;

    const {uId} = req.session;

    User.findOne({
        _id: uId
    })
    .select('-_id chatUsers rooms')
    .populate('chatUsers')
    .exec((err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        let result = [];
        for(let i = 0; i < user.rooms.length; i++) {
            result[i] = {
                uId: user.chatUsers[i]._id,
                uName: user.chatUsers[i].username,
                uProfilePicture: user.chatUsers[i].profilePicture,
                room: user.rooms[i],
                isUserOnline: global.socketConnections.includes(user.chatUsers[i]._id.toString()) ? true : false
            };
        }

        // console.log(result);
        res.end(JSON.stringify(result));
    })
});

module.exports = app;