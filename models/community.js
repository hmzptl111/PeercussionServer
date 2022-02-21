const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communityStructure = {
    mId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    mName: {
        type: String,
        required: true
    },
    cName: {
        type: String,
        required: true,
        unique: true
    },
    cThumbnail: {
        type: String
    },
    desc: {
        type: String,
        maxLength: 255,
        required: true
    },
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }],
    followers: {
        type: Number,
        required: true,
        default: 0
    },
    upvotes: {
        type: Number,
        required: true,
        default: 0
    },
    downvotes: {
        type: Number,
        required: true,
        default: 0
    },
    relatedCommunities: [{
        type: mongoose.Types.ObjectId,
        ref: 'Community'
    }],
    restrictedUsers: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
};

const communityOptions = {
    timestamps: true
};

const communitySchema = new Schema(communityStructure, communityOptions);

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;