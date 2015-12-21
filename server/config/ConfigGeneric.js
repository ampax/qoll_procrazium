var filename='server/config/GenericConfig.js';


initWithDev = function(){
	qlog.info('Initializing for chemwiki@dev - ' + SITE_URL, filename);
	Accounts.loginServiceConfiguration.remove({
		service : "chemwiki"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "chemwiki",
		clientId: "98769uyiyohj9876986_jhgfjkg21222.apps.chemwiki.com",
		secret: "1QYX4loolOoV-mzm_80p9JX4",
	});
}

initWithProd = function(){
	qlog.info('Initializing for chemwiki@prod', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "chemwiki"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "chemwiki",
	    clientId : "98769uyiyohj9876986_jhgfjkg21222.apps.chemwiki.com",
	    secret : "1QYX4loolOoV-mzm_80p9JX4"
	});
}