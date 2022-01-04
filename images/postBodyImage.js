const multer = require('multer');
const express = require('express');
const app = express.Router();
require('dotenv').config();
const fs = require('fs');

const uuidv4 = require('uuid').v4;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const uuid = uuidv4();
        const ext = file.mimetype.split('/');
        cb(null, uuid + '.' + ext[1]);
    }
});

const imageFilters = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 10
    // },
    fileFilter: imageFilters
});

app.post('/:type', upload.single('postBodyImage'), async (req, res) => {
    if(req.params.type === 'postBodyImageFromDevice') {
        const result = {
                'success': 1,
                'file': {
                    'url': `${process.env.ROOT_URL}/uploads/${req.file.filename}`
                }
            };
        res.end(JSON.stringify(result));
    } else if(req.params.type === 'postBodyImageFromUrl') {
        const url = req.body.url.split('.');
        const ext = url[url.length - 1];
        const uuid = uuidv4();
        const filename = uuid + '.' + ext
        const file = fs.createWriteStream(`./uploads/${filename}`);

        //change it to only support https in production
        const protocol = req.body.url.split(':')[0];
        if(protocol === 'https') {
            const https = require('https');

            https.get(req.body.url, result => {
                result.pipe(file);
                file.on('finish', function() {
                    file.close(() => {
                        const result = {
                            'success': 1,
                            'file': {
                                'url': `${process.env.ROOT_URL}/uploads/${filename}`
                            }
                        };
                        res.end(JSON.stringify(result));
                    });
                  });
            });
        } else if(protocol === 'http') {
            const http = require('http');
            
            http.get(req.body.url, result => {
                result.pipe(file);
                file.on('finish', function() {
                    file.close(() => {
                        const result = {
                            'success': 1,
                            'file': {
                                'url': `${process.env.ROOT_URL}/uploads/${filename}`
                            }
                        };
                        res.end(JSON.stringify(result));
                    });
                  });
            });
        }

    }
});

module.exports = app;