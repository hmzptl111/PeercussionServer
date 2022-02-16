const express = require('express');
const app = express.Router();

app.post('', (req, res) => {
    if(req.session && req.session.isAuth) {
        res.json({
            message: {
                uId: req.session.uId,
                uName: req.session.uName,
                isAuth: req.session.isAuth
            }
        });
        res.end();
        return;
    } else {
        res.json({
            error: 'Session unavailable'
        });
        res.end();
        return;
    }
})

module.exports = app;