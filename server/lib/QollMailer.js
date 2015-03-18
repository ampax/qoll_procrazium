var filename="server/lib/QollMailer.js";

//process.env.MAIL_URL = 'smtp://webmaster@qoll.io:Kaushik793:smtp.gmail.com:465/';
//process.env.MAIL_URL = 'smtp://procrazium:Champak(&(:smtp.gmail.com:465/';

/**Meteor.startup(function () {
    qlog.info('Initializing env variable MAIL_URL', filename);
    process.env.MAIL_URL = 'smtp://postmaster%40sandbox13abbf253d304e93b0cd81e7228f7f9d.mailgun.org:8a1fad3df28bdbb583ba6369bf832aba%40smtp.mailgun.org:587';
});**/

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

    //Email.send(mailOptions);
};

QollMailer.sendQollEmail = function(from, to, subject, msg) {

    Meteor.Mandrill.send(
    {   host:          "smtp.mandrillapp.com"
      , port:           587
      , to:             to//"customer@anydomain.com"
      , from:           from //"you@yourdomain.com"
      , subject:        subject
      , body:           msg
      , text: msg // plaintext body
      , html: msg // html body
      , authentication: "LOGIN"
      , username:       "procrazium@gmail.com"//username
      , password:       "RG5hQXbJ1JZry6yMPCGchQ"//Lucknow12#"//password
      , key:            "RG5hQXbJ1JZry6yMPCGchQ"
      }, function(err, result){
        if(err){
          console.log(err);
        }
      }
    );
};

Meteor.methods({
    sendContactUsEmail : function(from, to, subject, msg) {
        return QollMailer.sendContactUsEmail(from, to, subject, msg);
    },
    sendQollstionnaireMail : function(qollstionnaire_id) {
        qlog.info('------------------- Called sending the questionnaire method -------------------');
        var from = Meteor.user().profile.email;
        var name = Meteor.user().profile.name;
        var from_beau = name + '<' + from  + '>';

        var q = Qolls.QollstionnaireDb.get({_id : qollstionnaire_id});
        var post =  q.title;

        var subject = q.title;

        qlog.info('Prepared subject - ' + subject + ', post - ' + post + ', qollstionnaire_id - ' + qollstionnaire_id, filename);

        var responses = new Array();
        q.submittedTo.forEach(function(to){
            qlog.info('Sending email to - ' + to + ', subject - ' + subject + ', post - ' + post, filename);
            responses.push(QollMailer.sendQollEmail(from_beau, to, subject, formatHtmlEmail(to, subject, post, qollstionnaire_id)));
        });

        return responses;
    },
    sendQollMail : function(to, qollId) {
        var from = Meteor.user().profile.email;
        var name = Meteor.user().profile.name;
        from = name + '<' + from  + '>';

        //Prepare Qoll text to send in the email - 
        var q = Qolls.QollDb.get({_id : qollId});

        var post =  q.title === q.qollText? q.qollText : q.title + ' ' + q.qollText;

        var subject = q.title;

        /** START ::::: Replace the fill in the blanks if it is of FIB type **/
        if(q.cat === QollConstants.QOLL_TYPE.BLANK)
            while (matches = QollRegEx.fib_transf.exec(post)) {
                post = post.replace(matches[0], ' ______ ');
            }

        if(q.cat === QollConstants.QOLL_TYPE.BLANK)
            while (matches = QollRegEx.fib_transf.exec(subject)) {
                subject = subject.replace(matches[0], ' ______ ');
            }
        /** END ::::: Replace the fill in the blanks if it is of FIB type **/

        return QollMailer.sendQollEmail(from, to, subject, formatHtmlEmail(from, subject, post));
    },
});

var formatHtmlEmail = function(email, title, message, id) {
    // Converts a String to word array
    //var enc_email = CryptoJS.enc.Utf16.parse('kaushik.anoop@gmail.com'); 
    // 00480065006c006c006f002c00200057006f0072006c00640021
    // var email = 'kaushik.anoop@gmail.com';
    
    var fmt_msg = 
    '<table>'+
        '<tr style="background-color: #FFF1FF; border: 1px solid #ddd; font-size 18px;">'+
            '<td><a href="'+URLUtil.SITE_URL+'ext_email_board/'+id+'/'+email+'/email"><img src="http://qoll.io/img/QollBrand.png"/></a></td>'+
            '<td><a href="'+URLUtil.SITE_URL+'ext_email_board/'+id+'/'+email+'/email"><h4 style="font-size: 18px;">'+title+'</h4></a></td>'+
        '</tr>'+
        '<tr>'+
               '<td>&nbsp;</td><td><h5 style="font-size: 14px;">'+message+'</h5></td>'+
        '</tr>'+
        '<tr>'+
                '<td colspan="2"><a href="'+URLUtil.SITE_URL+'ext_email_board/'+id+'/'+email+'/email">Take qoll</a></td>'
        '</tr>'+
        '<tr>'+
               '<td>&nbsp;</td><td>©2014 Millennials Venture Labs </td>'+
        '</tr>'+
    '</table>';

    return fmt_msg;
};

