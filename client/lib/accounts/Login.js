var filename = 'client/lib/accounts/Login.js';
// ---------------------- new accounts ui config----------------------
Accounts.ui.config({
    requestPermissions: {
		//facebook: ['email','id','name','first_name','last_name','username','gender','locale','age_range',
	    //	'email', 'user_friends', 'user_location', 'user_events', 'friends_events', 'friends_location', 'friends_about_me',
        //   'user_status', 'friends_status', 'read_friendlists'],
        google: ['https://www.google.com/m8/feeds'],//['https://accounts.google.com/o/oauth2/auth?approval_prompt=force&access_type=offline'],//'https://www.google.com/m8/feeds', 
        github:['user', 'public_repo']
	},
	requestOfflineToken: { google: true },
    passwordSignupFields: 'USERNAME_AND_EMAIL_CONFIRM', //USERNAME_AND_EMAIL
    extraSignupFields: [{
        fieldName: 'first-name',
        fieldLabel: 'First name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please enter your first name");
            return false;
          } else {
            return true;
          }
        }
    }, {
        fieldName: 'last-name',
        fieldLabel: 'Last name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please enter your last name");
            return false;
          } else {
            return true;
          }
        }
    }, /** {
        fieldName: 'gender',
        showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        fieldLabel: 'Gender',
        inputType: 'radio',
        radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
        data: [{                    // Array of radio options, all properties are required
            id: 1,                  // id suffix of the radio element
            label: 'Male',          // label for the radio element
            value: 'm'              // value of the radio element, this will be saved.
          }, {
            id: 2,
            label: 'Female',
            value: 'f',
            checked: 'checked'
        }],
        visible: true
    }, **/ {
        fieldName: 'country',
        fieldLabel: 'Country',
        inputType: 'select',
        showFieldLabel: true,
        empty: 'Please select your country of residence',
        data: [{
            id: 1,
            label: 'United States',
            value: 'us'
          }, /** {
            id: 2,
            label: 'Spain',
            value: 'es',
        } **/],
        visible: true
    }, {
        fieldName: 'terms',
        fieldLabel: 'I accept the terms and conditions',
        inputType: 'checkbox',
        visible: true,
        saveToProfile: false,
        validate: function(value, errorFunction) {
            if (value) {
                return true;
            } else {
                errorFunction('You must accept the terms and conditions.');
                return false;
            }
        }
    }]
});

// -------------------------------------------------------------------




/**
Accounts.ui.config({
	requestPermissions: {
		//facebook: ['email','id','name','first_name','last_name','username','gender','locale','age_range',
	    //	'email', 'user_friends', 'user_location', 'user_events', 'friends_events', 'friends_location', 'friends_about_me',
        //   'user_status', 'friends_status', 'read_friendlists'],
        google: ['https://www.google.com/m8/feeds'],//['https://accounts.google.com/o/oauth2/auth?approval_prompt=force&access_type=offline'],//'https://www.google.com/m8/feeds', 
        github:['user', 'public_repo']
	},
	requestOfflineToken: {
		google: true
	},
	passwordSignupFields: 'USERNAME_AND_EMAIL', USERNAME_AND_EMAIL_CONFIRM
	//sendVerificationEmail: true,
});
**/

Login = {};

/**
	Global login-with-service method 
**/
Login.loginWithService = function(service){
	//handle in if/else for the kind of service being used for loggin in
	qlog.info('xxxxxxxxxx loginWithService xxxxxxxxxx', filename);
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
	} /**else if(service === 'password') {
		qlog.info('Printing the options - '+JSON.stringify(opt), filename);
		if(opt.email == undefined || opt.password == undefined) {
			qlog.info('Enter login id and password to login', filename);
			return;
		}

		Meteor.loginWithPassword(opt.email, opt.password, function (err) {
		    if(err){
		        //notify.show(i18n.translate('Signin error'), i18n.translate(err.reason));
		        console.log(err)
		    }
		});
	}**/
}

Login.logoutFromService = function() {
	Meteor.logout(function(err){
	    if(err) {
			qlog.error('Failed to logout ...' + err, filename);
	    } else {
			qlog.info('Logged out user', filename);
			Router.go('/'); //Go to homepage on logout
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
	    	//requestPermissions:['user', 'public_repo']
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
	return;
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
	    requestPermissions: ['email','id','name','first_name','last_name','username','gender','locale','age_range',
	    'email', 'user_friends', 'user_location', 'user_events', 'friends_events', 'friends_location', 'friends_about_me',
            'user_status', 'friends_status', 'read_friendlists']
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
	    	//requestPermissions: ['profile','email','openid']
	    	//requestPermissions: ['https://www.google.com/m8/feeds']
	    	requestPermissions: "openid email https://www.googleapis.com/auth/drive https://www.google.com/m8/feeds",
		    requestOfflineToken: true,
		    forceApprovalPrompt: true
		}, function(err){
		    if(err) {
				qlog.error('Error occured while logging in with google ...' + err, filename);
				 Session.set('errorMessage', err.reason || 'Unknown error');
				 return;
		    } else {
				qlog.info('Logged in with google. Refreshing the contacts now.', filename);
				/**if ( ! Meteor.loggingIn()){
					Meteor.call('refreshGoogleContacts', function(err, success){
						if(err) {
							qlog.info('Error happened while refreshing google contacts. Try again - '+ err, filename);
						} else {
							if(success)
								qlog.info('Refreshed data', filename);
							else qlog.info('Did not refresh the data', filename);
						}
					});
				}**/
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