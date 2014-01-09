var filename='server/config/ConfigGit.js';

initWithGitDev = function(){
	qlog.info('Initializing for git@dev', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "github"
	});

	//localhost:3000
	Accounts.loginServiceConfiguration.insert({
		service : "github",
		    clientId : "ad22c3e0382350c31295",
		    secret : "8cc3b97bac92fdecab10315401df5adb0f4fbbc2"
	});
}

initWithGitServer = function(){
	qlog.info('Initializing for git@server', filename);
	Accounts.loginServiceConfiguration.remove({
		service : "github"
	});

	//qoll.meteor.com
	Accounts.loginServiceConfiguration.insert({
		service : "github",
		    clientId : "6d3de54b922896239fa5",
		    secret : "fbc202312b2752d0654a00b35ef00452cd5b725f"
	});
}