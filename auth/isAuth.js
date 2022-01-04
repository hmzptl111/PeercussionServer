const isAuth = (req, res, next) => {
    if(req.session && req.session.isAuth) {
        next();
    } else {
        res.status(401);
        res.end(JSON.stringify({
            error: 'Unauthentic request'
        }));
    }
};

module.exports = isAuth;