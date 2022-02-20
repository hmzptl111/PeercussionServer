const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postStructure = {
    uId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    uName: {
        type: String,
        required: true
    },
    uProfilePicture: {
        type: String
    },
    cId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    cName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: Array,
        required: false,
        default: {}
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
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    totalComments: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String,
        required: false
    }
}

const postOptions = {
    timestamps: true
}

const postSchema = new Schema(postStructure, postOptions);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;