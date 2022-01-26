const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomStructure = {
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    messages: {
        type: Array
    }
}

const roomSchema = new Schema(roomStructure);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;