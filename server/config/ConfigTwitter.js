var filename='server/config/ConfigTwitter.js';

/**Accounts.loginServiceConfiguration.remove({"service": "twitter"});
Accounts.loginServiceConfiguration.insert({
 "service": "twitter",
 "consumerKey" : "<yours>",
 "secret" : "<yours>"
});
Twitter: consumerKey, secret
**/


//http://meteor.hromnik.com


initWithTwitterDev = function(){
	qlog.info('Initializing for twitter@dev - ' + SITE_URL, filename);
	Accounts.loginServiceConfiguration.remove({
		service : "twitter"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "twitter",
		secret : "tIHer7vAf4u0wClO8YA0Ion6r5pDaPG8jbo22rwJtBCXUrBBxp",
		consumerKey : "Oz3sZqawSiMv1Mh1Ymd5kgzX8",
	});
}

initWithTwitterServer = function(){
	qlog.info('Initializing for twitter@server', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "twitter"
	});

	Accounts.loginServiceConfiguration.insert({
		service : "twitter",
	    secret : "TYKoKT1MWnWzT5EPdK4muGhqPonruw37tec6JudgL4qDky1ZnW",
	    consumerKey : "Qqh3oor6PE7wIZFvJCfrDCJ3m",
	});
}