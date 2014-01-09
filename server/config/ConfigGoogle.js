var filename='server/config/ConfigGoogle.js';

initWithGoogleDev = function(){
	qlog.info('Initializing for google@dev', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "google"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "google",
	    clientId : "633950422798-qio0hqjo8ss6lnkrmuasanl6d2d4l77o.apps.googleusercontent.com",
	    apiKey : "wp_fvhsQeneclo30A9DoUPE0"
	    //scopes : 'https://www.googleapis.com/auth/plus.me'
	});
}

initWithGoogleServer = function(){
	qlog.info('Initializing for google@server', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "google"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "google",
	    clientId : "1032957758612.apps.googleusercontent.com",
	    secret : "1032957758612@developer.gserviceaccount.com"
	});
}