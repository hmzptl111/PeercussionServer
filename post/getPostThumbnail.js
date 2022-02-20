const express = require('express');
const app = express();

const Community = require('../models/community');
const User = require('../models/user');
const Post = require('../models/post');


app.post('/:type', (req, res) => {
    const {type} = req.params;
    const {uId} = req.session;
    const {postsOffset} = req.body;

    User.findOne({
        _id: uId
    })
    .select('-_id followingCommunities upvotedPosts downvotedPosts')
    .exec((err, user) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }
        
        if(type === 'home') {
            if(!user || user.followingCommunities.length <= 0) {
                console.log('User isn\'t signed in or user doesn\'t follow any community');

                Post.find({})
                .skip(postsOffset)
                .sort({
                    'createdAt': -1
                })
                .limit(3)
                .exec(async (err, fetchedPosts) => {
                    if(err) {
                        res.json({
                            error: err
                        });
                        res.end();
                        return;
                    }

                    // all other methods create 'posts' by referencing 'fetchedPosts' which wouldn't allow updates and since stringifying and parsing the array returns a new data structure, this approach was finalized
                    let posts = JSON.parse(JSON.stringify(fetchedPosts));
                    for(let i = 0; i < posts.length; i++) {
                        if(user && user.upvotedPosts.toString().includes(posts[i]._id.toString())) {
                            posts[i].isUpvoted = true;
                        } else if(user && user.downvotedPosts.toString().includes(posts[i]._id.toString())) {
                            posts[i].isDownvoted = true;
                        } else {
                            posts[i].isUpvoted = false;
                            posts[i].isDownvoted = false;
                        }
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
                .exec((err, fetchedPosts) => {
                    if(err) {
                        res.json({
                            error: err
                        });
                        res.end();
                        return;
                    }

                    let posts = JSON.parse(JSON.stringify(fetchedPosts));
                    for(let i = 0; i < posts.length; i++) {
                        if(user && user.upvotedPosts.toString().includes(posts[i]._id.toString())) {
                            posts[i].isUpvoted = true;
                        } else if(user && user.downvotedPosts.toString().includes(posts[i]._id.toString())) {
                            posts[i].isDownvoted = true;
                        } else {
                            posts[i].isUpvoted = false;
                            posts[i].isDownvoted = false;
                        }
                    }
    
                    res.json({
                        message: posts
                    });
                    res.end();
                    return;
                });
            }
        } else if(type === 'community') {
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

                //
                let posts = JSON.parse(JSON.stringify(community.posts));
                for(let i = 0; i < posts.length; i++) {
                    if(user && user.upvotedPosts.toString().includes(posts[i]._id.toString())) {
                        posts[i].isUpvoted = true;
                    } else if(user && user.downvotedPosts.toString().includes(posts[i]._id.toString())) {
                        posts[i].isDownvoted = true;
                    } else {
                        posts[i].isUpvoted = false;
                        posts[i].isDownvoted = false;
                    }
                }
                //

                res.json({
                    message: posts
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
                    limit: 20,
                    skip: postsOffset
                },
                select: '-body -comments -createdAt -updatedAt -__v'
            })
            .exec((err, fetchedUser) => {
                if(err) {
                    res.json({
                        error: err
                    });
                    res.end();
                    return;
                }
    
                if(!fetchedUser) {
                    res.json({
                        error: 'User does not exist'
                    });
                    res.end();
                    return;
                }

                //
                let posts = JSON.parse(JSON.stringify(fetchedUser.posts));
                for(let i = 0; i < posts.length; i++) {
                    if(user && user.upvotedPosts.toString().includes(posts[i]._id.toString())) {
                        posts[i].isUpvoted = true;
                    } else if(user && user.downvotedPosts.toString().includes(posts[i]._id.toString())) {
                        posts[i].isDownvoted = true;
                    } else {
                        posts[i].isUpvoted = false;
                        posts[i].isDownvoted = false;
                    }
                }
                //

                res.json({
                    message: posts
                });
                res.end();
                return;
            });
        }
    });
});

module.exports = app;