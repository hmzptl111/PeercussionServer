const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communityStructure = {
    mId: {
        type: mongoose.Types.ObjectId,
        immutable: true,
        required: true
    },
    mName: {
        type: String,
        immutable: true,
        required: true
    },
    cName: {
        type: String,
        immutable: true,
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