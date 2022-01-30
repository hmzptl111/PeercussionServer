const express = require('express');
const app = express();

const User = require('../models/user');
const Community = require('../models/community');


app.post('', (req, res) => {
    const {cName} = req.body;
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

        Community.findOne({
            cName: cName
        })
        .populate('relatedCommunities', 'cName')
        .exec((err, targetCommunity) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!targetCommunity) {
                console.log('Community doesn\'t exist');
                return;
            }
            
            let communities = [];
            targetCommunity.relatedCommunities.forEach(c => {
                console.log(c);
                let community = {
                    cId: c._id,
                    cName: c.cName
                };

                if(!user.moderatesCommunities.includes(c._id)) {
                    console.log('not a moderator');
                    if(user.followingCommunities.includes(c._id)) {
                        console.log('a follower');
                        community.isFollowing = 'yes';
                    } else {
                        console.log('not a follower');
                        community.isFollowing = 'no';
                    }
                }

                communities.push(community);
            });

            res.end(JSON.stringify(communities));
        });
    })
});

module.exports = app;











// const express = require('express');
// const app = express();

// const Community = require('../models/community');

// app.post('', (req, res) => {
//     const {cName} = req.body;

//     Community.findOne({
//         cName: cName
//     })
//     .exec((err, community) => {
//         if(err) {
//             console.log(`Something went wrong: ${err}`);
//             return;
//         }
//         if(!community) {
//             console.log('Community doesn\'t exist');
//             return;
//         }

//         res.end(JSON.stringify(community.relatedCommunities));
//     });
// });

// module.exports = app;