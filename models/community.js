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
    desc: {
        type: String,
        required: true
    },
    posts: {
        type: Array,
        required: true,
        default: []
    },
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
    relatedCommunities: {
        type: Array,
        required: true,
        default: []
    }
};

const communityOptions = {
    timestamps: true
};

const communitySchema = new Schema(communityStructure, communityOptions);

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;