const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
    }
});

const sendMail = (uId, uMail) => {
    jwt.sign({
        uId: uId
    }, process.env.EMAIL_SECRET, {
        expiresIn: '1h'
    }, (err, token) => {
        if(err) {
            console.log(`Something went wrong: ${err}`);
            return;
        }
        console.log(token);

        transporter.sendMail({
            to: uMail,
            subject: 'Confirm Email - Peercussion',
            html: `<a href = http://localhost:3001/emailConfirmation/${token}>Confirm Email</a>`
        });
    });
}

module.exports = sendMail;