var filename = 'server/Accounts.js';

QollAccounts = {};

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
    /**user.profile.access_token = user.services.facebook.accessToken;**/
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
  Meteor.setTimeout(function() {
    Accounts.sendVerificationEmail(user._id);
  }, 2 * 1000);

  return user;
});


Accounts.validateLoginAttempt(function(attempt){
  qlog.info('Validating login attempt - ' + JSON.stringify(attempt), filename);

  if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified ) {
    console.log('email not verified');
    throw new Meteor.Error(100002, reason, 'Please check your email and verify user account [' + reason +']');
    return false; // the login is aborted
  }

  if (attempt.error){
      var reason = attempt.error.reason;
      qlog.info('Will be increasing the count here ... ' + attempt.error.reason, filename);
      if (reason === "User not found" || reason === "Incorrect password" || 
          reason === "Username already exists." || reason === 'Email already exists.' ){
          qlog.info('Incorrect pasword or user not found .... throwing error ... ' + reason);
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

