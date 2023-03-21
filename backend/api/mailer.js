const nodemailer = require ('nodemailer');
const config = require('../config/mailer');


const transport = nodemailer.createTransport({
    service: 'Mailgun',
    auth : {
        user: config.MAILGUN_USER,
        pass: config.MAILGUN_PASSWORD
    },
    tls: {
       rejectunauthorized: false
    }
});

module.exports = {
    sendEmail(from, to , subject, html) {
        return p = new Promise((resolve, reject ) => {
            transport.sendMail({from, to , subject, html}, (err, info) => {
                if (err) return reject(err);
                resolve(info);  
            });
        });
    }
}

