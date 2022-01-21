const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require('dotenv').config;

const userStructure = {
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }],
    about: {
        type: String
    },
    points: {
        type: Number
    },
    friends: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    pendingFriendRequests: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    friendRequestsSent: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    isAccountPrivate: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String
    },
    upvotedPosts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }],
    downvotedPosts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }],
    upvotedComments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }],
    downvotedComments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }],
    moderatesCommunities: [{
        type: mongoose.Types.ObjectId,
        ref: 'Community'
    }],
    followingCommunities: [{
        type: mongoose.Types.ObjectId,
        ref: 'Community'
    }],
    restrictedFrom: [{
        type: mongoose.Types.ObjectId,
        ref: 'Community'
    }],
}

const userOptions = {
    timestamps: true
}

const userSchema = new Schema(userStructure, userOptions);

const User = mongoose.model('User', userSchema);

// userSchema.pre('save', async function(next) {
//     this.profilePicture = process.env.ROOT_URL + '/static/images/' + this.username.toLowerCase();
//     next();
// });

module.exports = User;