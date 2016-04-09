var filename='server/Config.js';

var MeteorInitialize = new Meteor.Collection("MeteorInitialize");


// ensure the indexes
//Query ===================> 
// {"$or":[
// {"share_circle":{"$all":["ChemWiki"]}},
// {"submittedBy":"gXq7Hk5JHz5gu79QM","action":{"$ne":"archive"}},
// {"visibility":"public","action":{"$ne":"archive"}},
// "visibility":"private","action":{"$ne":"archive"},
// "accessToGroups":{"$in":["BizleeCollaborationGroup"]}}
//]}

Meteor.startup(function(){
	// Let us ensure indexes of Qoll schema coz this will be the biggest collection
	Qoll._ensureIndex({ "share_circle": 1});
	Qoll._ensureIndex({ "submittedBy": 1, "action": 1});
	Qoll._ensureIndex({ "visibility": 1, "action": 1});
	Qoll._ensureIndex({ "accessToGroups": 1});

	// Let us ensure indexes of Qollstionnaire coz this will be another bigggg collection
	Qollstionnaire._ensureIndex({ "submittedTo": 1, "status": 1});
});

Meteor.startup(function(){
	qlog.info('Site url: '+URLUtil.SITE_URL, filename);
	
	//if(SITE_URL.startsWith('http://localhost')){
	if( 'http://localhost:3000/' == URLUtil.SITE_URL ){
		qlog.info('Site url: ' + process.env.ROOT_URL, filename);
		//Initialize localhost for login with github
		initWithGitDev();
		initWithFacebookDev();
		initWithGoogleDev();
		initWithTwitterDev();

		ServiceConfig.remove('chemwiki');
		ServiceConfig.insert(ServiceConfig.Generic.Dev);

		/**var InitUserForProfile = 'InitDefaultProfile';
		//use this to find if this init has already run. Else initizlize.
		Meteor.users.find({}).map(function(user){
			if(!user.profile) {
				qlog.info('User profile not defined for user - ' + JSON.stringify(user) + '. setting default.', filename);
				var profile = {"profile":{}};
				Meteor.users.update({_id : user._id}, { $set: update });
				qlog.info('User profile not defined for user - ' + JSON.stringify(user) + '. setting default.', filename);
			}
		});  **/
	} else if(URLUtil.SITE_URL === 'http://qoll.io/'){
		qlog.info('Site url: ' + process.env.ROOT_URL, filename);
		//Initialize localhost for login with github
		initWithGitServer();
		initWithFacebookServer();
		initWithGoogleServer();
		initWithTwitterServer();

		ServiceConfig.remove('chemwiki');
		ServiceConfig.insert(ServiceConfig.Generic.Prod);
	}

});


// in server code
Meteor.startup(function() {
	qlog.info('Starting up the mandrill connection now .....', filename);

	process.env.MAIL_URL = 'smtp://procrazium@gmail.com:RG5hQXbJ1JZry6yMPCGchQ@smtp.mandrillapp.com:587/'; 

    return Meteor.Mandrill.config({
    	username: "procrazium@gmail.com", // username: "YOUR_MANDRILL_USERNAME",
	    key: "RG5hQXbJ1JZry6yMPCGchQ", // key: "YOUR_MANDRILL_API_KEY"
        
    });
});

// (server-side)
Meteor.startup(function() {
  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
  Accounts.emailTemplates.from = 'Admin(Qoll - Discovery In Motion) <webmaster@qoll.io>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = 'Qoll - Discovery In Motion';

  // A Function that takes a user object and returns a String for the subject line of the email.
  /** Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Confirm Your Email Address';
  }; **/

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return 'click on the following link to verify your email address: ' + url;
  };

  PrettyEmail.options = {
	  from: 'Qoll (Admin) - Discovery In Motion <webmaster@qoll.io>',
	  logoUrl: URLUtil.SITE_URL+'img/QollBrand.png',
	  companyName: 'Qoll - Discovery In Motion',
	  companyUrl: URLUtil.SITE_URL,
	  companyAddress: 'Qoll Street, 070070, Qoll City, NJ, USA',
	  companyTelephone: '+11111111111',
	  companyEmail: 'webmaster@qoll.io',
	  siteName: 'QOll'
	};

	PrettyEmail.style = {
	  fontFamily: 'Helvetica',
	  textColor: '#606060',
	  buttonColor: '#FF3300',//#FFFFFF',
	  buttonBgColor: '#222',//#007FFF'
	};

	PrettyEmail.defaults.verifyEmail = {
	  heading: 'Activate Your Qoll Account Here.',
	  headingSmall: 'Qoll - Discovery In Motion, is an opportunity to collaboratively self improve. Become a part of it today.',
	  buttonText: 'Activate Qoll Account'
	};
});



// populate share-circle on startup, if it is not there - two right now
Meteor.startup(function(){
	var share_circle = QollShareCircle.find({}).fetch();
	if(!share_circle || share_circle.length == 0) {
		QollShareCircle.insert({'description' : 'ChemWiki share circle to give access to all the qolls created by people in this circle',
								'share_circle' : 'ChemWiki', 'access' : 'private'});

		QollShareCircle.insert({'description' : 'Qoll super-share-circle',
								'share_circle' : 'QollSuperShare', 'access' : 'private'});
	}
});
