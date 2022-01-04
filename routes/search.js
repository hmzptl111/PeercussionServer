const express = require('express');
const app = express.Router();

const Community = require('../models/community');

app.post('/:type', async (req, res) => {

    if(req.params.type === 'community') {
        const text = req.body.text;
        console.log(text);
        if(text === '') {
            res.end();
            return;
        }

        const pattern = /\W/g;
        const isInvalid = pattern.test(text);

        if(!isInvalid) {
            Community.find({
                cName: {
                    $regex: new RegExp(text, 'g')
                }
            }, (err, result) => {
                if(err) {
                    console.error(err);
                    res.end();
                } else {
                    let communities = [];

                    result.forEach(c => {
                        let _id = c._id;
                        let cName = c.cName;
                        let community = {
                            _id,
                            cName
                        }
                        communities = [...communities, community];
                    });

                    res.end(JSON.stringify(communities));
                }
            }
            );
        } else {
            res.end('invalid characters');
            return;
        }
    }
});

module.exports = app;