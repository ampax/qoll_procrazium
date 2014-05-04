var filename='server/Config.js';
SITE_URL = Meteor.absoluteUrl();

Meteor.startup(function(){
	qlog.info('Site url: '+SITE_URL, filename);
	qlog.info('Site url: ' + process.env.ROOT_URL, filename);

	if(SITE_URL === 'http://localhost:3000/'){
		//Initialize localhost for login with github
		initWithGitDev();
		//initWithFacebookDev();
		//initWithGoogleDev();
	} else if(SITE_URL === 'http://qoll.io/'){
		//Initialize localhost for login with github
		initWithGitServer();
		initWithFacebookServer();
		initWithGoogleServer();
	}

});