const mongoose = require('mongoose');

const connectDB = (DB_URI) => {
    return new Promise((resolve, reject) => {
        try {
            mongoose.connect(DB_URI);
            resolve('Database connection established');
        } catch(e) {
            reject('Couldn\'t connect to database');
        }
    });
}

module.exports = connectDB;