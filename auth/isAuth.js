const isAuth = (req, res, next) => {
    if(req.session && req.session.isAuth) {
        next();
    } else {
        res.json({
            error: 'Unauthentic request, please sign in'
        });
        res.end();
        return;
    }
};

module.exports = isAuth;