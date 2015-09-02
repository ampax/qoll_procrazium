var filename="server/lib/Google.js";

Ggl = {};

Ggl.SocialFunGoogle = function(user){
	var config = Accounts.loginServiceConfiguration.findOne({service: 'google'});

	var opts= { 
		email: user.services.google.email,
		consumerKey: config.clientId,
	    consumerSecret: config.secret,
	    token: user.services.google.accessToken,
	    refreshToken: user.services.google.refreshToken,

	};

	qlog.info('Fetching users google contacts now ----', filename);
	qlog.info(JSON.stringify(config), filename);
	qlog.info(JSON.stringify(user), filename);
	qlog.info(JSON.stringify(opts), filename);

	var gcontacts = new GoogleContacts(opts);
	// gcontacts.refreshAccessToken opts.refreshToken, (err, accessToken);
	gcontacts.refreshAccessToken = Meteor._wrapAsync(gcontacts.refreshAccessToken.bind(gcontacts));
	// gcontacts.refreshAccessTokenSync = Meteor.wrapAsync(gcontacts.refreshAccessToken.bind(gcontacts));

	gcontacts.refreshAccessToken(opts.refreshToken, function (err, accessToken)
    {
        if(err && err!=null)
        {
            console.log ('gcontact.refreshToken, ', err);
            return false;
        }
        else
        {
            gcontacts.token = accessToken;

            opts['token'] = accessToken;
            gcontacts1 = new GoogleContacts(opts);
            gcontacts1.getContactsSync = Meteor._wrapAsync(gcontacts1.getContacts.bind(gcontacts1));

		    gcontacts1.getContactsSync(
		    function(err, contact)
		    {
		    	if(err) {
		    		console.log('=======> Error happened while getting google contacts <======== - ' + err);
		    	} else {
				    var count = 1;
			    	contact.map(function(c){
			    		c['createdAt'] = new Date();
			    		c['whoPulled'] = user._id;
			    		c['social_type'] = 'google';
			    		c['active'] = 1;
			    		//console.log('Contact  ' + count++ + ' - ' + JSON.stringify(c));
			    		SocialDb.insertSocialConnect(user._id, c.email, c);
			    	});
			    	qlog.info('========> Contacts imported from google <======== - ' + contact.length, filename);
			    }
		    });
        }
    });
}
