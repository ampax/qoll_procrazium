var filename='server/Config.js';

var MeteorInitialize = new Meteor.Collection("MeteorInitialize");

Meteor.startup(function(){
	qlog.info('Site url: '+URLUtil.SITE_URL, filename);
	
	//if(SITE_URL.startsWith('http://localhost')){
	if( 'http://localhost:3000/' == URLUtil.SITE_URL ){
		qlog.info('Site url: ' + process.env.ROOT_URL, filename);
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
		qlog.info('Site url: ' + process.env.ROOT_URL, filename);
		//Initialize localhost for login with github
		initWithGitServer();
		initWithFacebookServer();
		initWithGoogleServer();
	}

});


// in server code
Meteor.startup(function() {
	qlog.info('Starting up the mandrill connection now .....', filename);
    return Meteor.Mandrill.config({
    	username: "procrazium@gmail.com", // username: "YOUR_MANDRILL_USERNAME",
	    key: "RG5hQXbJ1JZry6yMPCGchQ", // key: "YOUR_MANDRILL_API_KEY"
        
    });
});