const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
    }
});

const sendMail = (identifier, uMail, mSubject, targetPath, textContent, clientSide = false) => {
    jwt.sign({
        identifier: identifier
    }, process.env.EMAIL_SECRET, {
        expiresIn: '12h'
    }, (err, token) => {
        if(err) {
            res.json({
                error: err
            });
            res.end();
            return;
        }

        transporter.sendMail({
            to: uMail,
            subject: mSubject,
            html: `<a href = http://localhost:${clientSide ? '3000': process.env.PORT}/${targetPath}/${token}>${textContent}</a>`
        });
    });
}

module.exports = sendMail;