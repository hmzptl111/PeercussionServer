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
const getCommunityThumbnail = require('./community/getCommunityThumbnail');
const setCommunityThumbnail = require('./community/setCommunityThumbnail');

//user
const user = require('./user/getUser');
const friends = require('./user/getFriends');
const userComments = require('./user/getComments');
const pendingFriendRequests = require('./user/getPendingFriendRequests');
const getProfilePicture = require('./user/getProfilePicture');
const setProfilePictureFromCamera = require('./user/setProfilePictureFromCamera');
const setProfilePictureUsingLocalImage = require('./user/setProfilePictureUsingLocalImage');
const removeProfilePicture = require('./user/removeProfilePicture');


//post
const post = require('./post/getPost');

//posts
const postThumbnail = require('./post/getPostThumbnail');


//comments
const createComment = require('./comments/createComment');
const comments = require('./comments/getComments');

//vote
const votePost = require('./post/votePost');
const voteComment = require('./comments/voteComment');


//auth
const signUp = require('./auth/signUp');
const signIn = require('./auth/signIn');
const signOut = require('./auth/signOut');
const userAuthStatus = require('./auth/userAuthStatus');

//follow
const follow = require('./routes/follow');
const unfollow = require('./routes/unfollow');
const followStatus = require('./routes/followStatus');
const acceptFriendRequest = require('./routes/acceptFriendRequest');

app.use('/uploads', express.static('./uploads'));
app.use('/uploads/postImages', express.static('./uploads/postImages'));
app.use('/uploads/profilePictures', express.static('./uploads/profilePictures'));
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));
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
app.use('/user', user);
app.use('/post', post);
app.use('/postThumbnail', postThumbnail);
app.use('/signUp', signUp);
app.use('/signIn', signIn);
app.use('/signOut', signOut);
app.use('/checkUserAuthStatus', userAuthStatus);
app.use('/createComment', createComment);
app.use('/comments', comments);
app.use('/votePost', votePost);
app.use('/voteComment', voteComment);
app.use('/getFriends', friends);
app.use('/getComments', userComments);
app.use('/follow', follow);
app.use('/unfollow', unfollow);
app.use('/followStatus', followStatus);
app.use('/acceptFriendRequest', acceptFriendRequest);
app.use('/pendingFriendRequests', pendingFriendRequests);
app.use('/getProfilePicture', getProfilePicture);
app.use('/setProfilePictureFromCamera', setProfilePictureFromCamera);
app.use('/setProfilePictureUsingLocalImage', setProfilePictureUsingLocalImage);
app.use('/removeProfilePicture', removeProfilePicture);
app.use('/getCommunityThumbnail', getCommunityThumbnail);
app.use('/setCommunityThumbnail', setCommunityThumbnail);