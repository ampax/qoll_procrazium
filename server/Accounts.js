var filename = 'server/Accounts.js';

QollAccounts = {};

Accounts.config({
  sendVerificationEmail: true,
});

/*
Accounts.onCreateUser(function(options, user){

  qlog.info('Printing flag .................................................', filename);

  var userProperties = {
    profile: options.profile || {},
    karma: 0,
    isInvited: false,
    isAdmin: false,
    postCount: 0,
    commentCount: 0,
    invitedCount: 0
  }
  user = _.extend(user, userProperties);

  if (options.email)
    user.profile.email = options.email;
    
  if (UserUtil.getEmail(user))
    user.email_hash = getEmailHash(user);
  
  if (!user.profile.name)
    user.profile.name = user.username;
  
  // set notifications default preferences
  user.profile.notifications = {
    users: false,
    posts: false,
    comments: true,
    replies: true
  }

  // add slug to the profile
  if (!user.profile.slug)
    user.profile.slug = user.slug;

  // if this is the first user ever, make them an admin
  if (!Meteor.users.find().count() )
    user.isAdmin = true;

  // give new users a few invites (default to 3)
  user.inviteCount = URLUtil.getSetting('startInvitesCount', 3);

  //trackEvent('new user', {username: user.username, email: user.profile.email});

  // if user has already filled in their email, add them to MailChimp list
  if(user.profile.email)
    addToMailChimpList(user);

  // send notifications to admins
  var admins = Meteor.users.find({isAdmin: true});

  qlog.info('Creating the user - ' + JSON.stringify(user), filename);

  if(user.services.facebook) {
    if(!user.profile.email)
      user.profile.email = user.services.facebook.email;
    user.profile.fb_id = user.services.facebook.username;
    user.profile.fb_link = user.services.facebook.link;
    user.profile.gender = user.services.facebook.gender;
    user.profile.locale = user.services.facebook.locale;
    // user.profile.access_token = user.services.facebook.accessToken;
    var friends = QFB.SocialFunFacebook(user);
  } else if(user.services.google) {
    if(!user.profile.email)
      user.profile.email = user.services.google.email;
    setTimeout(Ggl.SocialFunGoogle(user), 500);
  }

  //The following two blocks are important when you login with facebook or google, coz slug and username will not be populated
  if(user.slug != undefined && user.slug != null) {
    user.profile.slug = user.slug;
  } else if ((user.profile.slug == undefined || user.profile.slug == null) && UserUtil.getEmail(user)) {
    //slugify the email-id
    user.slug = UserUtil.getEmail(user).match(/^([^@]*)@/)[1];
    user.profile.slug = user.slug;
  }

  if(user.username == undefined || user.username == null) {
    user.username = user.slug;
  }

  //Initialize user settings
  Settings.insert({'userId' : user._id, 
    'editor_mode': QollConstants.EDITOR_MODE.HTML, 
    'access_mode' : QollConstants.QOLL.VISIBILITY.PUB});

  // we wait for Meteor to create the user before sending an email
  qlog.info('Printing services - ' + user.services, filename);
  if (!user.services.facebook && !user.services.google) {
    qlog.info('Sending account verification email here', filename);
    Meteor.setTimeout(function() {
      Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);
  }

  Meteor.setTimeout(function() {
    // send an email to the team telling who has joined just now
    Meteor.call("sendWhoJoinedEmail", user._id, function(error, msg) {
      if (error) {
        qlog.error('Error happened while sending who joined email; who: ' + user._id + ', error: ' + error, filename);;
      } else {
        qlog.info('Sent who joined email to the team; who: ' + user._id + ', msg: ' + msg, filename);
      }
    });
  }, 10 * 1000);

  // check if a user account already exists for this email id - 
  var usr_csr = Meteor.users.find({'registered_email': user.profile.email}).fetch();

  if(usr_csr.length > 0) {
    qlog.info('--------------> Another account registered with the same email-id. Join the two accounts', filename);
    qlog.info('........................................................................................', filename);
    qlog.info('Account (1) ' + JSON.stringify(user), filename);
    qlog.info('Account (2) ' + JSON.stringify(usr_csr[0]), filename);
    qlog.info('........................................................................................', filename);

    user = usr_csr[0];
    user.another_tried = 'will it get updated?';
  }

  user.registered_email = user.profile.email;

  return user;
});
**/

Accounts.validateLoginAttempt(function(attempt){
  // qlog.info('Validating login attempt - ' + JSON.stringify(attempt), filename);

  if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
    console.log('email not verified');
    var reason = attempt.error? attempt.error.reason : 'Verify email please';
    //throw new Meteor.Error(100002, reason, 'Please check your email and verify user account [' + reason +']');
    throw new Meteor.Error(403, reason, 'Please check your email and verify user account [' + reason +']');
    return false; // the login is aborted
  }

  if (attempt.error){
      var reason = attempt.error.reason;
      qlog.info('Will be increasing the count here ======================> -------> ' + attempt.error.reason, filename);
      if (reason === "User not found" || reason === "Incorrect password" || 
          reason === "Username already exists." || reason === 'Email already exists.' ){
          qlog.info('Incorrect pasword or user not found .... throwing error ... ' + reason, filename);
          //throw new Meteor.Error(403, "Login forbidden 123");
          //throw new Error("Login forbidden 123");
          throw new Meteor.Error(403, reason, 'Incorrect password or user not found error happened [' + reason +']');
          //throw "Login forbidden 123";
          //return false;
      }
  }
  return true;
});



Accounts.onLoginFailure(function(attempt){
  qlog.info('Will be increasing the count here ... ' + attempt.error.reason, filename);
    if (attempt.user && attempt.error.reason === "Login forbidden") {
        // Increments the number of failed login attempts
        //Meteor.users.update(attempt.user._id, {$inc: {failedLogins: 1}});
        qlog.info('Will be increasing the count here ...', filename);
        throw new Meteor.Error(500, "Login forbidden", "details", "more details");
    }

    else if(attempt.user && attempt.error.reason) 
      throw new Meteor.Error(500, attempt.error.reason, "details", "more details");
});

Accounts.emailTemplates.verifyEmail.text = function(user, url) {
  return 'click on the following link to verify your email address: ' + url;
};


//Accounts.emailTemplates.from = "MySiteName <username@yourDomain.com>";

getEmailHash = function(user){
  // todo: add some kind of salt in here
  return CryptoJS.MD5(UserUtil.getEmail(user).trim().toLowerCase() + user.createdAt).toString();
}

addToMailChimpList = function(user){
  // add a user to a MailChimp list.
  // called when a new user is created, or when an existing user fills in their email
  if((MAILCHIMP_API_KEY=URLUtil.getSetting('mailChimpAPIKey')) && (MAILCHIMP_LIST_ID=URLUtil.getSetting('mailChimpListId'))){

    var email = UserUtil.getEmail(user);
    if (! email)
      throw 'User must have an email address';

    console.log('adding "'+email+'" to MailChimp list…');
    
    var mailChimp = new MailChimpAPI(MAILCHIMP_API_KEY, { version : '1.3', secure : false });
    
    mailChimp.listSubscribe({
      id: MAILCHIMP_LIST_ID,
      email_address: email,
      double_optin: false
    });
  }
}

Meteor.methods({
  changeEmail: function(newEmail) {
    Meteor.users.update(Meteor.userId(), {$set: {emails: [{address: newEmail}]}});
  },
  numberOfPostsToday: function(){
    console.log(numberOfItemsInPast24Hours(Meteor.user(), Posts));
  },
  numberOfCommentsToday: function(){
    console.log(numberOfItemsInPast24Hours(Meteor.user(), Comments));
  },
  testEmail: function(){
    Email.send({from: 'test@test.com', to: UserUtil.getEmail(Meteor.user()), subject: 'Telescope email test', text: 'lorem ipsum dolor sit amet.'});
  },
  testBuffer: function(){
    // TODO
  },
  getScoreDiff: function(id){
    var object = Posts.findOne(id);
    var baseScore = object.baseScore;
    var ageInHours = (new Date().getTime() - object.submitted) / (60 * 60 * 1000);
    var newScore = baseScore / Math.pow(ageInHours + 2, 1.3);
    return Math.abs(object.score - newScore);
  },
  setEmailHash: function(user){
    var email_hash = CryptoJS.MD5(UserUtil.getEmail(user).trim().toLowerCase()).toString();
    Meteor.users.update(user._id, {$set : {email_hash : email_hash}});
  },
  addCurrentUserToMailChimpList: function(){
    addToMailChimpList(Meteor.user());
  }
});

// Accounts.sendVerificationEmail;

Accounts.onLogin(function(attempt) {
  var method_name = attempt.methodName;
  
  var services = attempt.user.services;
  //qlog.info('CONFIRMING INIT VALUES FOR THE USER ACCOUNT - ' + attempt.user._id + '/' + method_name + '\n/' + JSON.stringify(services), filename);
  

  var usr_csr = Meteor.users.find({_id : attempt.user._id}).fetch();
  if(usr_csr.length == 0)
    return;

  var user = usr_csr[0];

  if(!user.profile.init) {
    user.profile.init = {};

    Settings.insert({'userId' : user._id, 
    'editor_mode': QollConstants.EDITOR_MODE.TEMPLATE, 
    'access_mode' : QollConstants.QOLL.VISIBILITY.PUB})
  }

  if(services.facebook && !user.profile.init.fb_initialized 
      || services.google && !user.profile.init.google_initialized
      || services.twitter && !user.profile.init.twitter_initialized)
    user.profile.init.initialized = false;

  if(user.profile.init.initialized === true) {
    // user has already been initialized with the information, return from here
    return;
  }

  user.profile.init.initialized = true;

  //enriching the user data here - 
  user.profile.email = user.registered_emails? user.registered_emails[0].address
                        : user.emails? user.emails[0].address : '';
  user.email_hash = getEmailHash(user);

  if(user.profile.first_name || user.profile.last_name)
    user.profile.name = profile.first_name? profile.first_name : '' + profile.last_name? profile.last_name : '';

  if(!user.profile.name) {
    // check if google or facebook account and populate appropriately
    if(services.facebook) {
      user.profile.name = services.facebook.name;
    } else if(services.google) {
      user.profile.name = services.google.name;
    } else if(services.twitter) {
      // nothing
    }
  }

  if(!user.profile.picture) {
    if(services.google) {
      user.profile.picture = services.google.picture;
    } else if(services.twitter) {
      user.profile.picture = services.twitter.profile_image_url;
    }
  }
  
  if(user.username)
    user.profile.slug = user.username;
  else if(user.profile.email && user.profile.email != '') {
    //slugify the email
    user.profile.slug = URLUtil.slugify(user.profile.email);
  } else if(services && services.twitter) {
    user.profile.slug = services.twitter.screenName;
  }

  user.slug = user.profile.slug;

  if(services.facebook && !user.profile.init.fb_initialized) {
    user.profile.init.fb_initialized = true;
    user.profile.fb_id = user.services.facebook.username;
    user.profile.fb_link = user.services.facebook.link;
    user.profile.gender = user.services.facebook.gender;
    user.profile.locale = user.services.facebook.locale;
    // user.profile.access_token = user.services.facebook.accessToken;
    qlog.info('Fetching facebook contacts here', filename);
    Meteor.setTimeout(function() { QFB.SocialFunFacebook(user) });
  }

  if(user.services.google && !user.profile.init.google_initialized) {
    user.profile.init.google_initialized = true;
    setTimeout(Ggl.SocialFunGoogle(user), 500);
  }

  Meteor.users.update({_id : attempt.user._id}, user);


  
  /** services.forEach(function(s) {
    qlog.info(s);
  }); **/


  //fix the slug and profile information for email login

  //fix the slug and profile information for google login

  //fix the slug and profile information for facebook login

  //fix the slug and profile information for linkedin login
});

var serviceAddedCallback = function(user_id, service_name) {
  qlog.info('Running post account call back for SERVICE - ' + service_name, filename);
  if (service_name == 'facebook') {
    qlog.info('FACEEEEEEBOOOOOOOKKK ...', filename);
    /* Meteor.setTimeout(function() {
      Accounts.sendVerificationEmail(user_id);
    }, 2 * 1000); */
  }

  if (service_name == 'google') {
    qlog.info('GOOOOOOOOOOGLEEEEEE ...', filename);
    /* Meteor.setTimeout(function() {
      Accounts.sendVerificationEmail(user_id);
    }, 2 * 1000); */
  }
};

var meldDBCallback = function(src_user_id, dst_user_id){
  //TODO
  qlog.info('MELDDDDDDDDBBBB CALLLLLLBACKKKKKK ...' + src_user_id + '/' + dst_user_id, filename);
};

var meldUserCallback = function(src_user, dst_user){
  qlog.info('CALLING MLDUSRCALLBACK ...' + src_user + '/' + dst_user, filename);
};


AccountsMeld.configure({
    askBeforeMeld : false,
    serviceAddedCallback : serviceAddedCallback,
    meldDBCallback : meldDBCallback,
    meldUserCallback : meldUserCallback,
});


