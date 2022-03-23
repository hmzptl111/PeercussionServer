const express = require('express');
const app = express();

const User = require('../models/user');

app.post('', (req, res) => {
    const {type, target} = req.body;
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

        if(!user) {
            res.json({
                message: {
                    isFollowing: 'no',
                    isOwner: 'no'
                }
            });
            res.end();
            return;
        }

        let isFollowing, isOwner;
        if(type === 'community') {
            isFollowing = user.followingCommunities.includes(target) ? 'yes' : 'no';
            isOwner = user.moderatesCommunities.includes(target) ? 'yes' : 'no';
        } else if(type === 'user') {
            console.log(type);
            isFollowing = user.friends.includes(target) ? 'yes' : 'no';
            if(isFollowing === 'no') {
                isFollowing = user.friendRequestsSent.includes(target) ? 'pending' : 'no';
                console.log(isFollowing);
            }
            isOwner = uId === target ? 'yes' : 'no';
        }

        res.json({
            message: {
                isFollowing: isFollowing,
                isOwner: isOwner
            }
        });
        res.end();
        return;
    });
});

module.exports = app;




















// const express = require('express');
// const app = express();

// const User = require('../models/user');

// app.post('', (req, res) => {
//     const {type, target} = req.body;
//     const {uId} = req.session;

//     User.findOne({
//         _id: uId
//     })
//     .exec((err, user) => {
//         if(err) {
//             res.json({
//                 error: err
//             });
//             res.end();
//             return;
//         }

//         if(!user) {
//             res.json({
//                 message: {
//                     isFollowing: 'no',
//                     isOwner: 'no'
//                 }
//             });
//             res.end();
//             return;
//         }

//         let isFollowing, isOwner;
//         if(type === 'community') {
//             isFollowing = user.followingCommunities.includes(target) ? 'yes' : 'no';
//             isOwner = user.moderatesCommunities.includes(target) ? 'yes' : 'no';
//         } else if(type === 'user') {
//             console.log(type);
//             isFollowing = user.friends.includes(target) ? 'yes' : 'no';
//             if(isFollowing === 'no') {
//                 isFollowing = user.friendRequestsSent.includes(target) ? 'pending' : 'no';
//                 console.log(isFollowing);
//             }
//             isOwner = uId === target ? 'yes' : 'no';
//         }

//         res.json({
//             message: {
//                 isFollowing: isFollowing,
//                 isOwner: isOwner
//             }
//         });
//         res.end();
//         return;
//     });
// });

// module.exports = app;