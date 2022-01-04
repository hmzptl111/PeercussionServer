const express = require('express');
const app = express.Router();

app.post('', (req, res) => {
    if(req.session && req.session.isAuth) {
        res.end(JSON.stringify({
            message: 'Session exists'
        }));
    } else {
        res.end(JSON.stringify({
            error: 'Session unavailable'
        }));
    }
})

module.exports = app;