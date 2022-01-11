const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentStructure = {
    uId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    pId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    uName: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    replies: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }],
    replyTo: {
        type: mongoose.Types.ObjectId
    }
}

const commentOptions = {
    timestamps: true
}

const commentSchema = new Schema(commentStructure, commentOptions);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;