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
            res.json({
                error: err
            });
            res.end();
            return;
        }

        Community.findOne({
            cName: cName
        })
        .populate('relatedCommunities', 'cName')
        .exec((err, targetCommunity) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }

            if(!targetCommunity) {
                res.json({
                    error: 'Community does not exist'
                });
                res.end();
                return;
            }
            
            let communities = [];
            targetCommunity.relatedCommunities.forEach(c => {
                console.log(c);
                let community = {
                    cId: c._id,
                    cName: c.cName,
                    isFollowing: 'no'
                };

                if(user && !user.moderatesCommunities.includes(c._id)) {
                    if(user.followingCommunities.includes(c._id)) {
                        community.isFollowing = 'yes';
                    }
                }

                communities.push(community);
            });

            res.json({
                message: communities
            });
            res.end();
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