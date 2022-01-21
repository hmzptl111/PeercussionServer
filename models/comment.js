const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentStructure = {
    uId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pId: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    pTitle: {
        type: String,
        required: true
    },
    cId: {
        type: mongoose.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    cName: {
        type: String,
        required: true
    },
    uName: {
        type: String,
        required: true
    },
    uProfilePicture: {
        type: String
    },
    comment: {
        type: String,
        required: true
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
    replies: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }],
    replyTo: {
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }
}

const commentOptions = {
    timestamps: true
}

const commentSchema = new Schema(commentStructure, commentOptions);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;