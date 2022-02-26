const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userStructure = {
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 32
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 64
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
        type: String,
        maxLength: 255
    },
    friends: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    rooms: [{
        type: mongoose.Types.ObjectId,
        ref: 'Chat'
    }],
    chatUsers: [{
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
    isEmailValidated: {
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
    }]
}

const userOptions = {
    timestamps: true
}

const userSchema = new Schema(userStructure, userOptions);

const User = mongoose.model('User', userSchema);

module.exports = User;