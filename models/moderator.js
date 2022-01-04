const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moderatorStructure = {
    cId: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true
    },
    uId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    removedPosts: {
        type: Array,
        default: []
    },
    removedComments: {
        type: Array,
        default: []
    },
    restrictedUsers: {
        type: Array,
        default: []
    }
}

const moderatorOptions = {
    timestamps: true
}

const moderatorSchema = new Schema(moderatorStructure, moderatorOptions);

const Moderator = mongoose.model('Moderator', moderatorSchema);

module.exports = Moderator;