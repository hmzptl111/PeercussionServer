const express = require('express');
const app = express();
require('dotenv').config();

const connectDB = require('./db/database');
const session = require('express-session');
const MongoDBSessionStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');

//initializations
const PORT = process.env.PORT || 3001;
const DB_URI = process.env.DB_URI;

connectDB(DB_URI)
    .then(res => {
        console.log(res);
        try {
            app.listen(PORT);
            console.log(`Server live on ${PORT}`);
        } catch(e) {
            console.log(e);
        }
    })
    .catch(e => {
        console.log(e);
    });

//routes
const create = require('./routes/create');
const search = require('./routes/search');

//images
const postBodyImage = require('./images/postBodyImage');

//community
const community = require('./community/getCommunity');

//post
const post = require('./post/getPost');

//posts
// const postsThumbnails = require('./posts/getPostsThumbnails');

//comments
const createComment = require('./comments/createComment');
const comments = require('./comments/getComments');

//vote
const vote = require('./post/votePost');

//auth
const signUp = require('./auth/signUp');
const signIn = require('./auth/signIn');
const signOut = require('./auth/signOut');
const userAuthStatus = require('./auth/userAuthStatus');

app.use('/uploads', express.static('./uploads'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

//
const store = new MongoDBSessionStore({
    uri: process.env.DB_URI,
    databaseName: 'peercussion',
    collection: 'sessions'
});
const sessionOptions = {
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionOptions));
//

app.use('/create', create);
app.use('/search', search);
app.use('/images', postBodyImage);
app.use('/community', community);
app.use('/post', post);
// app.use('/postsThumbnails', postsThumbnails);
app.use('/signUp', signUp);
app.use('/signIn', signIn);
app.use('/signOut', signOut);
app.use('/checkUserAuthStatus', userAuthStatus);
app.use('/createComment', createComment);
app.use('/comments', comments);
app.use('/vote', vote);