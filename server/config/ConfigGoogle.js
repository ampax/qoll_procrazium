var filename='server/config/ConfigGoogle.js';

initWithGoogleDev = function(){
	qlog.info('Initializing for google@dev - ' + SITE_URL, filename);
	Accounts.loginServiceConfiguration.remove({
		service : "google"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "google",
		// loginStyle: "popup",
		//3000
		//old interface - https://code.google.com/apis/console/b/0/?noredirect#project:126862771796:overview
	    //new interface - https://console.developers.google.com/project
	    //redirect uri - http://localhost:3000/_oauth/google?close
		"secret":"1QYX4loolOoV-mzm_80p9JX4",
		"clientId":"775190671310-n19etrb7ph4pmlqkkoe5c4svcu9f7b88.apps.googleusercontent.com",
	});
}

initWithGoogleServer = function(){
	qlog.info('Initializing for google@server', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "google"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "google",
		// loginStyle: "popup",
	    clientId : "775190671310-n19etrb7ph4pmlqkkoe5c4svcu9f7b88.apps.googleusercontent.com",
	    secret : "1QYX4loolOoV-mzm_80p9JX4"
	});
}