var filename="server/lib/QollMailer.js";

//process.env.MAIL_URL = 'smtp://webmaster@qoll.io:Kaushik793:smtp.gmail.com:465/';
//process.env.MAIL_URL = 'smtp://procrazium:Champak(&(:smtp.gmail.com:465/';

Meteor.startup(function () {
    qlog.info('Initializing env variable MAIL_URL', filename);
    process.env.MAIL_URL = 'smtp://postmaster%40sandbox13abbf253d304e93b0cd81e7228f7f9d.mailgun.org:8a1fad3df28bdbb583ba6369bf832aba%40smtp.mailgun.org:587';
});

QollMailer = {};

//var nodemailer = Meteor.require('nodemailer');

QollMailer.sendContactUsEmail = function(from, to, subject, msg) {
    // create reusable transport method (opens pool of SMTP connections)
    /**var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "webmaster@qoll.io",
            pass: "Kaushik793"
        }
    });**/

    // setup e-mail data with unicode symbols
    qlog.info("Sending mail from: " + from, filename);
    var mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: from +" : "+ subject, //"Hello ✔", // Subject line
        text: msg, // plaintext body
        html: msg // html body
    };

    Email.send(mailOptions);
};

QollMailer.sendEmail = function() {
    //TODO
};

Meteor.methods({
    sendContactUsEmail : function(from, to, subject, msg) {
        return QollMailer.sendContactUsEmail(from, to, subject, msg);
    },
});