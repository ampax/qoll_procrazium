var filename='server/config/ConfigFacebook.js';

initWithFacebookDev = function(){
	qlog.info('Initializing for facebook@dev', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "facebook"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "facebook",
	    appId : "1470750069818470",
	    secret : "b2b17e3a97b3c93a4c3034787fece677"
	});
}

initWithFacebookServer = function(){
	qlog.info('Initializing for facebook@server', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "facebook"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "facebook",
	    appId : "197724483746371",
	    secret : "6fdd6c2dd3e55b7eed947aca322e1415"
	});
}