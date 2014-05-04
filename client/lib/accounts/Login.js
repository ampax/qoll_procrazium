var filename = 'server/lib/Login.js';

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});

/**
	Global login-with-service method 
**/
loginWithService = function(service){
	//handle in if/else for the kind of service being used for loggin in
	if(service === 'github'){
		//login using github
		loginWithGithub();
	} else if(service === 'facebook'){
		//login using facebook
		loginWithFacebook();
	} else if(service === 'google'){
		//login using google
		loginWithGoogle();
	} else if(service === 'weibo'){
		//login using weibo
		loginWithWeibo();
	} else if(service === 'meetup'){
		//login using meetup
		loginWithMeetup();
	} else if(service === 'twitter'){
		//login using twitter
		loginWithTwitter();
	}
}

logoutFromService = function() {
	Meteor.logout(function(err){
	    if(err) {
			qlog.error('Failed to logout ...' + err, filename);
	    } else {
			qlog.info('Logged out user', filename);
	    }
	});
}

/**
	Client side local methods. These methods will be called upon
	to log in the users using any of the supported services.
**/

var loginWithGithub = function(){
	qlog.info('logging in with github', filename);
	Meteor.loginWithGithub({
	    	requestPermissions:['user', 'public_repo']
		}, function(err){
		    if(err) {
				qlog.error('Error occured while logging in with github ...' + err, filename);
		    } else {
				qlog.info('Logged in with github', filename);
		    }
	});
}

var loginWithFacebook = function(){
	qlog.info('logging in with facebook', filename);
	Meteor.loginWithFacebook({
	    	//https://developers.facebook.com/docs/reference/login/extended-permissions/
	    	/**
	    		(1) publish_actions - will be requested when the user decideds to post the qoll to his facebook page
	    		(2) user_friends - we can upfront request for user_friends or request it at the time user wants to post
	    		qoll to his friends. We are keeping it off the login process for now and will include it in the post qoll
	    		to friends section
	    		(3) user_location - this is user's current geo location. we will reuqest for it when required by the
	    		fuinctionality
	    		(4) user_friends - access to user's friends. request it when user is posting to his friends
	    		(5) user_groups - groups user is part of. request for it when user is posting to facebook groups.
	    	**/
	    	requestPermissions: ['email','id','name','first_name','last_name','username','gender','locale','age_range']
		}, function(err){
		    if(err) {
				qlog.error('Error occured while logging in with facebook ...' + err, filename);
		    } else {
				qlog.info('Logged in with facebook', filename);
		    }
	});
}

var loginWithGoogle = function(){
	qlog.info('logging in with google', filename);
	Meteor.loginWithGoogle({
	    	//https://developers.google.com/+/api/oauth#profile
	    	requestPermissions: ['profile','email','openid']
		}, function(err){
		    if(err) {
				qlog.error('Error occured while logging in with google ...' + err, filename);
		    } else {
				qlog.info('Logged in with google', filename);
		    }
	});
}

var loginWithWeibo = function(){
	qlog.info('logging in with weibo', filename);
}

var loginWithMeetup = function(){
	qlog.info('logging in with meetup', filename);
}

var loginWithTwitter = function(){
	qlog.info('logging in with twitter', filename);
}