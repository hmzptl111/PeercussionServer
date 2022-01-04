const express = require('express');
const app = express.Router();

app.post('', (req, res) => {
    console.log('request to sign out received');

    req.session.destroy((err) => {
        if(err) {
            res.status(400);
            res.end(JSON.stringify({
                error: 'Something went wrong'
            }));
        } else {
            res.end(JSON.stringify({
                message: 'Signed out'
            }));    
        }
    });
});

module.exports = app;