const {createServer} = require('http'); 
const {Server} = require('socket.io');
const express = require('express');
require('dotenv').config();

const connectDB = require('./db/database');
const session = require('express-session');
const MongoDBSessionStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const User = require('./models/user');
const Room = require('./models/room');


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
const sessionMiddleware = session(sessionOptions);
app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
    // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
    // connections, as 'socket.request.res' will be undefined in that case
});


let socketConnections = [];
global.socketConnections = socketConnections;

io.on('connection', (socket) => {
    console.log('socket connection established');

    socket.data.uId = socket.request.session.uId;
    socket.data.uName = socket.request.session.uName;

    console.log(socket.data.uId);
    console.log(socket.data.uName);

    global.socketConnections.push(socket.request.session.uId);

    console.log(`${socket.data.uName} connected`);

    User.findOne({
        _id: socket.data.uId
    })
    .exec((err, user) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        if(!user) {
            console.log('User doesn\'t exist');
            return;
        }

        const status = {
            uId: socket.data.uId,
            isUserOnline: true
        }

        let userRooms = [];
        user.rooms.forEach(r => {
            userRooms.push(r.toString());
        });

        socket.to(userRooms).emit('status', status);
    });

    socket.on('join', (rooms) => {
        socket.join(rooms);
        console.log(`${socket.data.uName} joined ${rooms}`);
    });

    socket.on('disconnect', () => {
        console.log(`${socket.data.uName} disconnected`);

        const updatedSocketConnections = global.socketConnections.filter(s => s !== socket.data.uId);
        global.socketConnections = updatedSocketConnections;

        User.findOne({
            _id: socket.data.uId
        })
        .exec((err, user) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!user) {
                console.log('User doesn\'t exist');
                return;
            }
    
            const status = {
                uId: socket.data.uId,
                isUserOnline: false
            }
    
            let userRooms = [];
            user.rooms.forEach(r => {
                userRooms.push(r.toString());
            });

            socket.to(userRooms).emit('status', status);
        });
    });

    socket.on('message', async (socketMessage, room) => {
        if(!room) return;
        
        const {type, time, message, roomID} = socketMessage;

        if(!message) return;

        const newMessage = {
            type,
            time,
            message,
            sender: socket.data.uName
        }
        console.log(newMessage);

        socket.to(room).emit('message', newMessage);

        Room.findOne({
            _id: roomID
        })
        .exec(async (err, targetRoom) => {
            if(err) {
                console.log(`Something went wrong: ${err}`);
                return;
            }
            if(!targetRoom) {
                console.log('Room doesn\'t exist');
                return;
            }

            if(!targetRoom.participants.includes(socket.data.uId)) {
                console.log('Unauthentic request');
                return;
            }
                
                targetRoom.messages.push(newMessage);
                await targetRoom.save();

                // socket.to(room).emit('message', newMessage);
            });
    });
});














//initializations
const PORT = process.env.PORT || 3001;
const DB_URI = process.env.DB_URI;

connectDB(DB_URI)
    .then(res => {
        console.log(res);
        try {
            httpServer.listen(PORT);
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

//mail
const emailConfirmation = require('./email/confirmMail');

//images
const postBodyImage = require('./images/postBodyImage');

//community
const community = require('./community/getCommunity');
const getCommunityThumbnail = require('./community/getCommunityThumbnail');
const setCommunityThumbnail = require('./community/setCommunityThumbnail');
const getRelatedCommunities = require('./community/getRelatedCommunities');
const getRestrictedUsers = require('./community/getRestrictedUsers');

//user
const user = require('./user/getUser');
const friends = require('./user/getFriends');
const userComments = require('./user/getComments');
const pendingFriendRequests = require('./user/getPendingFriendRequests');
const getProfilePicture = require('./user/getProfilePicture');
const setProfilePicture = require('./user/setProfilePicture');
const removeProfilePicture = require('./user/removeProfilePicture');
const getModeratesCommunities = require('./user/getModeratesCommunities');
const getFollowingCommunities = require('./user/getFollowingCommunities');
const getUpvotedPosts = require('./user/getUpvotedPosts');

//moderator
const restrictUser = require('./community/restrictUser');

//chat
const getChats = require('./chat/getChats');
const getChatRooms = require('./chat/getChatRooms');

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

// app.use(session(sessionOptions));
//

app.use('/create', create);
app.use('/emailConfirmation', emailConfirmation);
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
app.use('/setProfilePicture', setProfilePicture);
app.use('/removeProfilePicture', removeProfilePicture);
app.use('/getCommunityThumbnail', getCommunityThumbnail);
app.use('/setCommunityThumbnail', setCommunityThumbnail);
app.use('/getModeratesCommunities', getModeratesCommunities);
app.use('/getFollowingCommunities', getFollowingCommunities);
app.use('/getUpvotedPosts', getUpvotedPosts);
app.use('/getChats', getChats);
app.use('/getChatRooms', getChatRooms);
app.use('/restrictUser', restrictUser);
app.use('/getRelatedCommunities', getRelatedCommunities);
app.use('/getRestrictedUsers', getRestrictedUsers);