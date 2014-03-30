var filename="server/lib/QollMailer.js";

QollMailer = {};

var nodemailer = Meteor.require('nodemailer');

QollMailer.sendContactUsEmail = function(from, to, subject, msg) {
    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "webmaster@qoll.io",
            pass: "Kaushik793"
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, //"Hello ✔", // Subject line
        text: msg, // plaintext body
        html: msg // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}

Meteor.methods({
    sendContactUsEmail : function(from, to, subject, msg) {
        return QollMailer.sendContactUsEmail(from, to, subject, msg);
    },
});