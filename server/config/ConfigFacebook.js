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
	    appId : "660855753966370",
	    secret : "9c8f724f320faa387eca277cd472c33c"
	});
}