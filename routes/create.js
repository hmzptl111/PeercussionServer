const express = require('express');
const app = express.Router();

const Post = require('../models/post');
const Community = require('../models/community');

const isAuth = require('../auth/isAuth');

const containsSpecialChar = str => {
    const pattern = /\W/g;
    return pattern.test(str);
}

app.post('/:type', isAuth, async (req, res) => {
    if(req.params.type === 'post') {
        console.log('creating a post');

        if(req.body.title === '') {
            res.status(400);
            res.end('Community name can\'t be empty');
            return;
        }

        Community.findOne({
            _id: req.body.cId
        }, (err, result) => {
            if(err) {
                console.error(err);
            } else {
                if(!result) {
                    res.status(400);
                    res.end('Community doesn\'t exist');
                    return;
                } else {
                    const payload = {
                        //uId: "",
                        cId: req.body.cId,
                        uId: req.session.uId,
                        title: req.body.title,
                        body: req.body.body,
                        // upvotes: 0,
                        // downvotes: 0,
                        // comments: []
                    }
            
                    const post = new Post(payload);
                    post.save()
                        .then(result => {
                            Community.updateOne(
                                {
                                    _id: result.cId
                                },
                                {
                                    $push: {
                                        posts: {
                                            $each: [result._id],
                                            $position: 0
                                        }
                                    }
                                },
                                {
                                    new: true
                                },
                                (err, doc) => {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        console.log(doc);
                                    }
                                }
                            );

                            res.end(JSON.stringify(result.body));
                        })
                        .catch(err => {
                            res.status(400);
                            res.end('There was some problem while creating the post, please try again');
                            return;
                        });
                }
            }
        });
    } else if(req.params.type === 'community') {
        console.log('creating a community');

        if(req.body.cName === '') {
            res.status(400);
            res.end('Community name can\'t be empty');
            return;
        }

        const isInvalid = containsSpecialChar(req.body.cName);
        if(isInvalid) {
            res.status(400);
            res.end('Special characters aren\'t allowed');
            return;
        }

        //findOne => find
        Community.findOne({
            cName: req.body.cName
        }, (err, result) => {
            if(err) {
                console.error(err);
            } else {
                if(!result) {
                    const payload = {
                        mId: req.session.uId,
                        mName: req.session.uName,
                        cName: req.body.cName,
                        desc: req.body.desc,
                        // posts: [],
                        // followers: 0,
                        // upvotes: 0,
                        // downvotes: 0,
                        relatedCommunities: req.body.relatedCommunities
                    }
            
                    const community = new Community(payload);
                    community.save()
                        .then(result => {
                            console.log(result);
                            res.end(result.cName);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400);
                            res.end('There was some problem while creating the community, please try again');
                            return;
                        });
                } else {
                    res.status(400);
                    res.end('Community already exists');
                    return;
                }
            }
        });

        }
});

module.exports = app;