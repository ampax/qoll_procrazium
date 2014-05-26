var filename='server/config/ConfigGoogle.js';

initWithGoogleDev = function(){
	qlog.info('Initializing for google@dev - ' + SITE_URL, filename);
	Accounts.loginServiceConfiguration.remove({
		service : "google"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "google",
		//3000
		//old interface - https://code.google.com/apis/console/b/0/?noredirect#project:126862771796:overview
	    //new interface - https://console.developers.google.com/project
	    //redirect uri - http://localhost:3000/_oauth/google?close
		"secret":"lXbTWe9BtVpkldnUt8sTIgH8",
		"clientId":"864439868862-1ae1bk9q8da378vpufqk7us70rvupi76.apps.googleusercontent.com",
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