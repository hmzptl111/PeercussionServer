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
            res.json({
                error: err
            });
            res.end();
            return;
        }
        if(!room) {
            res.json({
                error: 'Room does not exist'
            });
            res.end();
            return;
        }
        if(!room.participants.includes(uId)) {
            res.json({
                error: 'You have to be friends with users you wish to communicate'
            });
            res.end();
            return;
        }

        res.json({
            message: room.messages
        });
        res.end();
        return;
    });
});

module.exports = app;