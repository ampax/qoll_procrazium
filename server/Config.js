var filename='server/Config.js';

var MeteorInitialize = new Meteor.Collection("MeteorInitialize");

Meteor.startup(function(){
	qlog.info('Site url: '+URLUtil.SITE_URL, filename);
	qlog.info('Site url: ' + process.env.ROOT_URL, filename);

	//if(SITE_URL.startsWith('http://localhost')){
	if( 'http://localhost:3000/' == URLUtil.SITE_URL ){
		//Initialize localhost for login with github
		initWithGitDev();
		initWithFacebookDev();
		initWithGoogleDev();

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
		//Initialize localhost for login with github
		initWithGitServer();
		initWithFacebookServer();
		initWithGoogleServer();
	}

});