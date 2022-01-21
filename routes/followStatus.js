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
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
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
        console.log(isFollowing);
        console.log(isOwner);
        res.end(JSON.stringify({
            isFollowing: isFollowing,
            isOwner: isOwner
        }));
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
//             console.log(`Something went wrong: ${err}`);
//             return;
//         }
//         if(!user) {
//             console.log('User doesn\'t exist');
//             return;
//         }

//         let isFollowing, isOwner;
//         if(type === 'community') {
//             isFollowing = user.followingCommunities.includes(target);
//             isOwner = user.moderatesCommunities.includes(target);
//         } else if(type === 'user') {
//             isFollowing = user.friends.includes(target);
//             isOwner = uId === target;
//         }
        
//         res.end(JSON.stringify({
//             isFollowing: isFollowing,
//             isOwner: isOwner
//         }));
//     });
// });

// module.exports = app;