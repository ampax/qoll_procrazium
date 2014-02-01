var filename = 'server/Accounts.js';

/**Accounts.onCreateUser(function(options, user){
	qlog.info('Printing the user information: ' + JSON.stringify(user), filename);
	qlog.info('Printing the options information: ' + JSON.stringify(options), filename);
	qlog.info('Printing the services: ' + JSON.stringify(user.services), filename);

    if (user.services) {
    	// Get the service and email from the user object returned by the service 
	    var service = _.keys(user.services)[0];
	    var email = user.services[service].email;
	    // Set the profile from options 
    	if (options.profile) {
	        user.services[service].profile = options.profile
	    }
	    qlog.info('Service: ' + service + ', email: ' + email);

	    // Set the email from user object returned by the service 
	    if (!email) {
	        if (user.emails) {
	            email = user.emails.address;
	        }
	    }

	    // Still no email, try the options 
	    if (!email) {
	        email = options.email;
	    }

	    // At this point, return since the user can not be mapped with no email 
	    if (!email) {
	        return user;
	    }

	    
	    //	Past this point, initialize the user with further information
	    //	See if any existing user has this email address
	    //	If there is no existing-user
	    
	    // see if any existing user has this email address, otherwise create new 
	    var existingUser = Meteor.users.findOne({'emails.address': email});
	    if(!existingUser) {
	        // if User exists else if user does not exist 
	        if(!userDoesntExist(email)) {
	        	// The user does not exist in the DB yet, initialize it with some more info and return it
	        	initUser(service, user);
	        	return user;
	        } else {
	        	// Find existing server for the service and email-id the user is trying to login with
	        	existingUser = existingUserForService(service, email);
	        	if(existingUser) {
	        		if(user.emails) {
	        			// User is signing in by emails, set it to user emails 
	        			existingUser.emails = user.emails;
	        		}
	        	}
	        }
	    }

	    // Precaution, these will exist from accounts-password if used 
	    if (!existingUser.services) {
	        existingUser.services = { resume: { loginTokens: [] }};
	    }
	    // Copy across the new service info 
	    existingUser.services[service] = user.services[service];
	    existingUser.services.resume.loginTokens.push(
	        user.services.resume.loginTokens[0]
	    );

	    //
	    //	Remove the existing record - CHECK WHY DO WE NEED THIS LOGIC HERE
	    //	Can we just update the existing record and 

	    Meteor.users.remove({_id: existingUser._id});
    }
});
**/


/** Find whether user with the email-id exists or not **/
var userDoesntExist = function(email) {
	/** Check if github user account exists for this email **/
	var existingGitHubUser = Meteor.users.findOne({'services.github.email': email});

	/** Check if google user account exists for this email **/
	var existingGoogleUser = Meteor.users.findOne({'services.google.email': email});

	/** Check if twitter user account exists for this email **/
    var existingTwitterUser = Meteor.users.findOne({'services.twitter.email': email});

    /** Check if facebook user account exists for this email **/
    var existingFacebookUser = Meteor.users.findOne({'services.facebook.email': email});

    var doesntExist = !existingGitHubUser && !existingGoogleUser && !existingTwitterUser && !existingFacebookUser;
}

/** 
	Return the user-object for the service user is trying to login with 
	services.github.email
	services.google.email
	services.twitter.email
	services.facebook.email
**/
var existingUserForService = function(service, email) {
	var s = 'services.'+service+'.email';
	return Meteor.users.findOne({s : email});
}


var initUser = function(service, user){

	if(service === 'github'){
		//init github user
		initGitHubUser(user);
	} else if(service === 'facebook'){
		//init facebook user
		initFacebookUser(user);
	} else if(service === 'google'){
		//init google user
		initGoogleUser(user);
	} else if(service === 'weibo'){
		//init weibo user
		initWeiboUser(user);
	} else if(service === 'meetup'){
		//init meetup user
		initMeetupUser(user);
	} else if(service === 'twitter'){
		//init twitter user
		initTwitterUser(user);
	} else{
		qlog.info("In ELSE STATEMENT USER INIT",filename);
		if((user.emails[0].address=='perfectly.cromulent@yahoo.com')||
			(user.emails[0].address=='procrazium@gmail.com')||
			(user.emails[0].address=='cozenlabs@gmail.com')){
			user.admin=true;
			user.profile = user.profile ||{};
			user.profile.admin = true;
		}
	}
}

var initGitHubUser = function(user){
	var accessToken = user.services.github.accessToken, result, profile;

	result = Meteor.http.get('https://api.github.com/user', {
		headers: {
		    'User-Agent' : 'Qoll/1.0'
		},
		params: {
		    access_token : accessToken
		}
	});

	qlog.info('Received user result from github: ' + JSON.stringify(result), filename);
	qlog.info('Setting profile for the user: ' + JSON.stringify(user), filename);

	if(result.error)
	    throw result.error;

	profile = _.pick(result.data,
			 'login',
			 'name',
			 'avatar_url',
			 'url',
			 'company',
			 'blog',
			 'location',
			 'email',
			 'bio',
			 'html_url'
			 );

	//user.services.github.profile = profile;
	user.services.profile = profile;
	user.profile = profile;

	return user;
}

var initFacebookUser = function(user){
	var accessToken = user.services.facebook.accessToken, result, profile;

	result = Meteor.http.get('https://graph.facebook.com/me', {
		headers: {
		    'User-Agent' : 'Qoll/1.0'
		},
		params: {
		    access_token : accessToken
		}
	});

	qlog.info('Received user result from facebook: ' + JSON.stringify(result), filename);

	if(result.error)
	    throw result.error;

	profile = _.pick(result.data,
			 'login',
			 'name',
			 'url',
			 'company',
			 'blog',
			 'location',
			 'email',
			 'bio',
			 'html_url'
			 );
	profile['avatar_url'] = 'http://graph.facebook.com/'+user.services.facebook.id+'/picture?type=small'
	//http://graph.facebook.com/USERNAME_OR_USERID/picture?type=large
	//598298352

	//user.services.facebook.profile = profile;
	user.services.profile = profile;
	user.profile = profile;
}

var initGoogleUser = function(user){
	var accessToken = user.services.google.accessToken, result, profile;
	
	//result = Meteor.http.get('https://www.googleapis.com/auth/plus.me', {
	result = Meteor.http.get('https://accounts.google.com/o/oauth2/auth', {
		headers: {
		    'User-Agent' : 'Qoll/1.0'
		},
		params: {
		    access_token : accessToken
		}
	});

	qlog.info('Received user result from google: ' + JSON.stringify(result), filename);

	if(result.error)
	    throw result.error;

	//https://developers.google.com/accounts/docs/OAuth2Login#scopeparameter
	//https://accounts.google.com/o/oauth2/token
	//https://accounts.google.com/o/oauth2/auth
	//https://www.googleapis.com/plus/v1/people/me
}

var initWeiboUser = function(user){
	var accessToken = user.services.weibo.accessToken, result, profile;
}

var initMeetupUser = function(user){
	var accessToken = user.services.meetup.accessToken, result, profile;
}

var initTwitterUser = function(user){
	var accessToken = user.services.twitter.accessToken, result, profile;
}


