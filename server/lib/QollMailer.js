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
    sendWhoJoinedEmail : function(user_id) {
      return whoJoinedEmail( user_id );
    },
    sendContactUsEmail : function(from, to, subject, msg) {
        return QollMailer.sendContactUsEmail(from, to, subject, msg);
    },
    sendQollstionnaireMail : function(qollstionnaire_id, userId) {
        qlog.info('------------------- Called sending the questionnaire method -------------------');
        var user = userId? Meteor.users.find({
            "_id" : userId
        }).fetch()[0] : Meteor.user();

        qlog.info('=====> Found user ' + JSON.stringify(user), filename);


        var from = user.profile.email;
        var name = user.profile.name;
        var from_beau = name + '<' + from  + '>';

        var q = Qolls.QollstionnaireDb.get({_id : qollstionnaire_id});
        var post =  q.title;

        var subject = q.title;

        var created_on = moment(q.submittedOn).format('MMM Do YYYY, h:mm a');

        qlog.info('Prepared subject - ' + subject + ', post - ' + post + ', qollstionnaire_id - ' + qollstionnaire_id, filename);

        var responses = new Array();
        q.submittedTo.forEach(function(to, idx){
            qlog.info('Sending email to - ' + to + ', subject - ' + subject + ', post - ' + post, filename);
            to_tmp = CoreUtils.encodeEmail(to); //to.replace(/\./g,"&#46;");
            responses.push(QollMailer.sendQollEmail(from_beau, to, subject, formatQollstionnaireHtmlEmail_pretty(to, name, created_on, subject, post, qollstionnaire_id, q.submittedToUUID[to_tmp])));
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

        return QollMailer.sendQollEmail(from, to, subject, formatQollstionnaireHtmlEmail(from, subject, post));
    },
    sendSocialContactToJoinQollMail : function(friend_id) {
        var from = Meteor.user().profile.email;
        var name = Meteor.user().profile.name;

        var friend = SocialDb.SocialConnect.get(friend_id);

        return QollMailer.sendQollEmail(from, friend.email, "Join Qoll Today", formatInvitationHtmlEmail(from, name, friend.email, friend.name));
    }
});


var formatInvitationHtmlEmail = function(from, from_name, to, to_name) {
    // Converts a String to word array
    //var enc_email = CryptoJS.enc.Utf16.parse('kaushik.anoop@gmail.com'); 
    // 00480065006c006c006f002c00200057006f0072006c00640021
    // var email = 'kaushik.anoop@gmail.com';

    var msg = to_name + ', '+ from_name + ' has invited you to join Qoll. Click on the link in the email to register with Qoll today.';
    
    var fmt_msg = 
    '<table>'+
        '<tr style="background-color: #FFF1FF; border: 1px solid #ddd; font-size 18px;">'+
            '<td><a href="'+URLUtil.SITE_URL+'"><img src="'+URLUtil.SITE_URL+'/logos/2/2 50 px.png"/></a></td>'+
            '<td><a href="'+URLUtil.SITE_URL+'"><h4 style="font-size: 18px;">Join Qoll today ...</h4></a></td>'+
        '</tr>'+
        '<tr>'+
               '<td>&nbsp;</td><td><h5 style="font-size: 14px;">'+msg+'</h5></td>'+
        '</tr>'+
        '<tr>'+
                '<td colspan="2"><a href="'+URLUtil.SITE_URL+'"><h4 style="font-size: 18px;">Join</a></td>'
        '</tr>'+
        '<tr>'+
               '<td>&nbsp;</td><td>©2014 Millennials Venture Labs </td>'+
        '</tr>'+
    '</table>';

    return fmt_msg;
};


var formatQollstionnaireHtmlEmail_pretty = function(email, name, created_on, title, message, id, user_q_uuid) {
    // Converts a String to word array
    //var enc_email = CryptoJS.enc.Utf16.parse('kaushik.anoop@gmail.com'); 
    // 00480065006c006c006f002c00200057006f0072006c00640021
    // var email = 'kaushik.anoop@gmail.com';

    var fmt_content = questionaire_header + questionaire_part_1 + title + questionaire_part_3 + created_on + questionaire_part_5 
                    + name + questionaire_part_7 
                    + '<a href="'+URLUtil.SITE_URL+'ext_email_board/'+user_q_uuid+'/'+id+'/'+email+'/email">Take qoll</a>'
                    + questionaire_part_9 + questionaire_footer;

    return fmt_content;
};




var whoJoinedEmail = function( user_id ) {
  var user_crsr = Meteor.users.find({ "_id" : user_id });
  qlog.info('New user with the id - ' + user_id + ' joined ...', filename);
  if( user_crsr == undefined )
    return;

  var user = user_crsr.fetch()[0];

  var recips = new Array();
  recips.push("cozenlabs@gmail.com");
  recips.push("procrzium@gmail.com");
  recips.push("kaushik.amit@gmail.com");
  recips.push("kaushik.anoop@gmail.com");
  /** recips.push(
    {
       "email":"procrzium@gmail.com",
       "name":"Procrazium Kaushik"
    }
  );

  recips.push(
    {
       "email":"cozenlabs@gmail.com",
       "name":"Cozenlabs Kaushik",
       "type":"to"
    }
  ); **/

  var fmt_content = questionaire_header + new_usr_email_1 
                    + new_usr_email_2 + user.profile.name //
                    + new_usr_email_4 + user.profile.email //
                    + new_usr_email_6 + moment(new Date()).format('MMM Do YYYY, h:mm a') //
                    + new_usr_email_8;

  /** QollMailer.sendQollEmail('webmaster@qoll.io', "kaushik.anoop@gmail.com", 'FYI: New user joined', fmt_content)
  return QollMailer.sendQollEmail('webmaster@qoll.io', "procrzium@gmail.com", 'FYI: New user joined', fmt_content); **/

  return QollMailer.sendQollEmail('webmaster@qoll.io', recips, 'FYI: New user joined', fmt_content);
}

var whoVerifiedEmail = function(email, user_id, service, joined_on) {
  //TODO
}





// -------------------- Following is the email content for sending questionaire in parts
var questionaire_header = '<table align="center" border="1" cellpadding="0" cellspacing="0" width="600">'+
    '<tr>'+
        '<td align="center" bgcolor="#312B23" style="padding: 13px 0 9px 0;">'+
            '<img src="http://qoll.io/logos/3/3.png" alt="Creating Email Magic" '+
                    'width="140" height="160" '+
                    'style="display: block; padding: 36px 0 30px 0; background-color: #312B23; border-color: firebrick;" />'+
        '</td>'+
    '</tr>'+

    '<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">';
     
var questionaire_part_1 =        '<table border="1" cellpadding="0" cellspacing="0" width="100%">'+

         '<tr>'+
          '<td style="font-style: oblique; font-size: large;">'+
           '<span style="font-style: normal; font-weight: 700;">Title:</span>';




            // questionaire_part_2 = ----- add questionnaire title at this point {{questionaire.title}}
          

 var questionaire_part_3 =         '</td>'+
         '</tr>'+
         '<tr>'+
          '<td style="padding: 20px 0 30px 0;">'+
           '<span style="color: rgb(84, 85, 197); font-weight: 900;">';

           // questionaire_part_4 = ------------ add created on in formatted order {{{created_on questionaire.createdOn}}}

var questionaire_part_5 =           '</span>, '+
           '<span style="color: rgb(169, 113, 113); font-weight: 900;">';

           // questionaire_part_6 ------------ add created by name here {{{questionaire.createdByName}}}

var questionaire_part_7 =           '</span> '+
           'has invited you take a Qoll. Use the following link to take the Questionnaire at <a href="http://qoll.io">Qoll.io</a>'+
          '</td>'+
         '</tr>'+
         '<tr>'+
          '<td>';


          // questionaire_part_8 = ---------- add take qoll link at this point  Take Qoll >>

var questionaire_part_9 =          '</td>'+
         '</tr>'+

        '</table>';

var questionaire_footer =    '</td>'+

     '<tr>'+
      '<td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">'+
         

         '<table border="0" cellpadding="0" cellspacing="0" width="100%">'+
         '<tr>'+
          
          '<td width="75%">'+
             '&reg; ©2014 Millennials Venture Labs '+
            '</td>'+
          
          '<td align="right">'+
             '<table border="0" cellpadding="0" cellspacing="0">'+
              '<tr>'+
               '<td>'+
                '<a href="http://qoll.io/">'+
                 '<img src="http://qoll.io/logos/3/3.png" alt="Twitter" width="38" height="38" style="display: block; background-color: #312B23;" border="0" />'+
                '</a>'+
               '</td>'+
              '</tr>'+
             '</table>'+
        '</td>'+

         '</tr>'+
        '</table>'+


        '</td>'+
     '</tr>'+
    '</table>';


// New user joined/verified email content
var new_usr_email_1 = '<table border="0" cellpadding="0" cellspacing="0" width="100%">';

var  new_usr_email_2 =   '<tr>'+
      '<td style="padding: 20px 0 30px 0;">'+
       'New user account created at <a href="http://qoll.io">Qoll.io</a>'+
      '</td>'+
     '</tr>'+

     '<tr>'+
      '<td style="padding: 20px 0 30px 0;">'+
       '<span style="color: rgb(84, 85, 197); font-weight: 900;">';

var new_usr_email_3 = 'Procrazium Kaushik';

var new_usr_email_4 = '</span><br>'+
       '<span style="color: rgb(84, 85, 197); font-weight: 900;">';

var new_usr_email_5 = 'procrazium@gmail.com';

var new_usr_email_6 = '</span><br>'+
       '<span style="rgb(169, 113, 113); font-weight: 900; font-weight: 900;">';

var new_usr_email_7 = '08/29/2014';

var new_usr_email_8 = '</span><br>'+
      '</td>'+
     '</tr>'+

    '</table>';
