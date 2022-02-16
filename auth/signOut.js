const express = require('express');
const app = express.Router();

app.post('', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }
        res.end();
    });
});

module.exports = app;