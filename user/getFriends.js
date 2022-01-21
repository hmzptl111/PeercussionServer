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
        .populate('friends', 'username')
        .exec((err, reqUser) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!reqUser) {
                console.log('User doesn\'t exist');
                return;
            }
    
            // console.log(user.friends);
            // console.log(reqUser.friends);
            let users = [];
            for(let i = 0; i < reqUser.friends.length; i++) {
                // if(reqUser.friends[i]._id.toString() === uId) continue;
                let temp = {_id: null, username: '', isFriend: false};
                temp._id = reqUser.friends[i]._id;
                temp.username = reqUser.friends[i].username;
                temp.isFriend = user.friends.includes(temp._id) ? 'yes' : 'no';
                if(temp.isFriend === 'no') {
                    isFriend = user.friendRequestsSent.includes(temp._id) ? 'pending' : 'no';
                }
                users[i] = temp;
            }
            console.log(users);

            res.end(JSON.stringify(users));
            return;
        });
    });

});

module.exports = app;