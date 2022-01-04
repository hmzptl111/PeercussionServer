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
    posts: {
        type: Array
    },
    comments: {
        type: Array
    },
    about: {
        type: String
    },
    points: {
        type: Number
    },
    friends: {
        type: Array
    },
    isAccountPrivate: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String
    },
    upvotedPosts: {
        type: Array
    },
    downvotedPosts: {
        type: Array
    },
    moderatesCommunities: {
        type: Array
    },
    followingCommunities: {
        type: Array
    },
    restrictedFrom: {
        type: Array
    }
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