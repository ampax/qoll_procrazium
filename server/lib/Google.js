var filename="server/lib/Google.js";

Ggl = {};

Ggl.SocialFunGoogle = function(user){
	var config = Accounts.loginServiceConfiguration.findOne({service: 'google'});

	var opts= { 
		consumerKey: config.clientId,
	    consumerSecret: config.secret,
	    token: user.services.google.accessToken,
	    refreshToken: user.services.google.refreshToken
	};

	var gcontacts = new GoogleContacts(opts);
	gcontacts.refreshAccessTokenSync = Meteor._wrapAsync(gcontacts.refreshAccessToken.bind(gcontacts));

	gcontacts.refreshAccessTokenSync(opts.refreshToken, function (err, accessToken)
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
		    		console.log('Error happened while getting google contacts - ' + err);
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
			    	qlog.info('Contacts imported from google - ' + contact.length, filename);
			    }
		    });
        }
    });
}
