const express = require('express');
const app = express();

const isAuth = require('../auth/isAuth');

const Room = require('../models/room');

app.post('', isAuth, (req, res) => {
    const {roomID} = req.body;
    const {uId} = req.session;
    
    Room.findOne({
        _id: roomID
    })
    .exec((err, room) => {
        if(err) {
            console.log(`Something went wrong`);
            return;
        }
        if(!room) {
            console.log('Room doesn\'t exist');
            return;
        }
        if(!room.participants.includes(uId)) {
            console.log('Unauthentic request');
            return;
        }

        res.end(JSON.stringify(room.messages));
    });
});

module.exports = app;