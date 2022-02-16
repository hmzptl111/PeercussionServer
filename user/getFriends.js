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
            res.json({
                error: err
            });
            res.end();
            return;
        }

        User.findOne({
            username: uName
        })
        .populate('friends', 'username')
        .exec((err, reqUser) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }

            if(!reqUser) {
                res.json({
                error: err
            });
            res.end();
            return;
            }
    
            let users = [];
            for(let i = 0; i < reqUser.friends.length; i++) {
                let temp = {_id: null, username: '', isFriend: false};

                temp._id = reqUser.friends[i]._id;
                temp.username = reqUser.friends[i].username;
                temp.isFriend = user && user.friends.includes(temp._id) ? 'yes' : 'no';

                if(temp.isFriend === 'no') {
                    isFriend = user && user.friendRequestsSent.includes(temp._id) ? 'pending' : 'no';
                }

                users[i] = temp;
            }

            res.json({
                message: users
            });
            res.end();
            return;
        });
    });

});

module.exports = app;