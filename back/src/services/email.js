const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const appRoot = require('app-root-path');

const ServerError = require('./errors/server');

class Email {
    constructor() {
        this.transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    send(to, link) {
        const mailPath = path.join(appRoot.toString(), 'front', 'mail.html');

        return fs.readFile(mailPath, 'utf8')
            .then((mailData) => {
                return this.transport.sendMail({
                    from: process.env.SMTP_USER,
                    to: to,
                    subject: 'API account activation',
                    text: '',
                    html: mailData.replace(
                        '{link}',
                        `${process.env.BASE_URL}/api/user/activate/${link}`
                    )
                });
            })
            .then(() => {
                return link;
            })
            .catch((err) => {
                throw new ServerError(
                    'Email Error',
                    'We\'re sorry, but there was an issue while trying to send the message. Please try again later.',
                    'An error occurred while trying to send the message. The issue has been logged for investigation.'
                );
            });
    }
}

module.exports = Email;