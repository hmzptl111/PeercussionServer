const express = require('express');
const app = express();

const Community = require('../models/community');
const User = require('../models/user');
const Post = require('../models/post');

app.post('/:type', (req, res) => {
    const {type} = req.params;
    const {uId} = req.session;
    const {postsOffset} = req.body;

    if(type === 'home') {
        console.log('home');

        User.findOne({
            _id: uId
        })
        .select('-_id followingCommunities')
        .exec((err, user) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }

            if(!user || user.followingCommunities.length <= 0) {
                console.log('User isn\'t signed in or user doesn\'t follow any community');

                Post.find({})
                .skip(postsOffset)
                .sort({
                    'createdAt': -1
                })
                .limit(3)
                .exec((err, posts) => {
                    if(err) {
                        res.json({
                            error: err
                        });
                        res.end();
                        return;
                    }

                    res.json({
                        message: posts
                    });
                    res.end();
                    return;
                });
            } else {
                Post.find({
                    cId: {
                        $in: user.followingCommunities
                    }
                })
                .skip(postsOffset)
                .sort({
                    'createdAt': -1
                })
                .limit(3)
                .exec((err, posts) => {
                    if(err) {
                        res.json({
                            error: err
                        });
                        res.end();
                        return;
                    }
    
                    res.json({
                        message: posts
                    });
                    res.end();
                    return;
                });
            }
        });
    } else if(type === 'community') {
        console.log('community');
        Community.findOne({
            cName: req.body.communityName
        })
        .select('-_id posts')
        .populate({
            path: 'posts',
            options: {
                limit: 3,
                skip: postsOffset
            },
            select: '-body -comments -createdAt -updatedAt -__v'
        })
        .exec((err, community) => {
            if(err) {
                res.json({
                    error: err
                });
                res.end();
                return;
            }
            if(!community) {
                res.json({
                    error: 'Community does not exist'
                });
                res.end();
                return;
            }
    
            res.json({
                message: community.posts
            });
            res.end();
            return;
        });
    } else if(type === 'user') {
        User.findOne({
            username: req.body.uName
        })
        .select('-_id posts')
        .populate({
            path: 'posts',
            options: {
                limit: 3,
                skip: postsOffset
            },
            select: 'uId uName cId cName title upvotes downvotes totalComments thumbnail'
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
                    error: 'User does not exist'
                });
                res.end();
                return;
            }

            res.json({
                message: user.posts
            });
            res.end();
            return;
        });
    }
});

module.exports = app;










// const express = require('express');
// const app = express();

// const Community = require('../models/community');
// const User = require('../models/user');
// const Post = require('../models/post');

// app.post('/:type', (req, res) => {
//     const {type} = req.params;
//     const {uId} = req.session;
//     const {postsOffset} = req.body;

//     if(type === 'home') {
//         console.log('home');

//         User.findOne({
//             _id: uId
//         })
//         .select('-_id followingCommunities')
//         .exec((err, user) => {
//             if(err) {
//                 console.log(`Something went wrong: ${err}`);
//                 return;
//             }
//             if(!user || user.followingCommunities.length <= 0) {
//                 console.log('User deosn\'t exist or user doesn\'t follow any community');

//                 Post.find({})
//                 .skip(postsOffset)
//                 .sort({
//                     'createdAt': -1
//                 })
//                 .limit(3)
//                 .exec((err, posts) => {
//                     if(err) {
//                         console.log(`Something went wrong: ${err}`);
//                         return;
//                     }

//                     console.log(posts);
//                     res.end(JSON.stringify(posts));
//                     return;
//                 });
//             } else {
//                 Post.find({
//                     cId: {
//                         $in: user.followingCommunities
//                     }
//                 })
//                 .skip(postsOffset)
//                 .sort({
//                     'createdAt': -1
//                 })
//                 .limit(3)
//                 .exec((err, posts) => {
//                     if(err) {
//                         console.log(`Something went wrong: ${err}`);
//                         return;
//                     }
    
//                     console.log(posts);
//                     res.end(JSON.stringify(posts));
//                     return;
//                 });
//             }
//         });
//     } else if(type === 'community') {
//         console.log('community');
//         Community.findOne({
//             cName: req.body.communityName
//         })
//         .select('-_id posts')
//         .populate({
//             path: 'posts',
//             options: {
//                 limit: 3,
//                 skip: postsOffset
//             },
//             select: '-body -comments -createdAt -updatedAt -__v'
//         })
//         .exec((err, community) => {
//             if(err) {
//                 res.status(400);
//                 res.end(JSON.stringify({
//                     error: `Something went wrong: ${err}`
//                 }));
//                 return;
//             }
//             if(!community) {
//                 console.log('Community doesn\'t exist');
//                 return;
//             }
    
//             if(community.posts.length < 3) {
//                 console.log('no more posts available');
//             }
//             res.end(JSON.stringify(community.posts));
//             return;
//         });
//     } else if(type === 'user') {
//         User.findOne({
//             username: req.body.uName
//         })
//         .select('-_id posts')
//         .populate({
//             path: 'posts',
//             options: {
//                 limit: 3,
//                 skip: postsOffset
//             },
//             select: 'uId uName cId cName title upvotes downvotes totalComments thumbnail'
//         })
//         .exec((err, user) => {
//             if(err) {
//                 res.status(400);
//                 res.end(JSON.stringify({
//                     error: `Something went wrong: ${err}`
//                 }));
//                 return;
//             }
//             if(!user) {
//                 console.log('Community doesn\'t exist');
//                 return;
//             }
    
//             if(user.posts.length < 3) {
//                 console.log('no more posts available');
//             }
//             res.end(JSON.stringify(user.posts));
//             return;
//         });
//     }
// });

// module.exports = app;