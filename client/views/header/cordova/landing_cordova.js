// debug in chrome by typing in the browser - about:inspect

Template.signin_qoll_cordova.events({

    'submit #loginform' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email_or_username = t.find('#email').value
        , password = t.find('#password').value;

      var verif_result = true;
      if(email_or_username.indexOf('@') === -1) {
      	// validate username if this is a username
      	verif_result = validateUsername(email_or_username);
      } else {
      	// validate email if this is email
      	verif_result = validateEmail(email_or_username);
      }

      if(!verif_result) return;

      verif_result = validatePassword(password);
      
      if(verif_result) {
      	// Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(email_or_username, password, function(err, result){
        	console.info('Logging in now ........................ ' + err);
	        if (err) {
	          // The user might not have been found, or their passwword
	          // could be incorrect. Inform the user that their
	          // login attempt has failed. 
	          console.info('Error happened and I am not logging in .... ' + err.message);
	          $('div.error-message').html(err.reason);
            Meteor.startup(function () {
              navigator.notification.alert("Your login failed", function() {});
            });
	        } else {
		          // The user has been logged in.
		        console.info('Logging in .... ');
		        $('div.error-message').html('User logging in success + ' + result);
		        // http://localhost:5000/inbox

            // Router.route('/items/:_id', {name: 'items.show'});

            /**Router.route('/nav_cordova', function () {
              this.render('nav_cordova');
            });**/

            Router.go('go_home_cordova');
		    }
      	});
      }

      console.info('Printing the user-id if any - ' + Meteor.userId());

        return false; 
      }
});

Template.register_qoll_cordova.events({

    'submit #loginform' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = t.find('#email').value
      	, username = t.find('#username').value
        , password = t.find('#password').value
        , password_confirmation = t.find('#password_confirmation').value;

      var verif_result = true;
      // verify email
      verif_result = validateEmail(email);
      if(!verif_result) return;

      // verify username
      verif_result = validateUsername(username);
      if(!verif_result) return;

      // verify password
      if(password !== password_confirmation) {
      	$('div.error-message').html("Password mis-match");
    	return;
      }
      verif_result = validatePassword(password);
      if(!verif_result) return;

      
      if(verif_result) {
      	// Trim and validate your fields here.... 

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Accounts.createUser({email: email, password : password, username : username}, function(err, result){
        	console.info('Registering user now ........................ ====> ' + err);
	        if (err) {
	          // The user might not have been found, or their passwword
	          // could be incorrect. Inform the user that their
	          // login attempt has failed. 
	          console.info('Not registering the user since error occured .... ' + err.message);
	          $('div.error-message').html(err.reason);
            Meteor.startup(function () {
              navigator.notification.alert("Error: " + err.reason, function() {});
            });
	        } else {
		          // The user has been logged in.
		        console.info('Registering in .... ');
		        $('div.error-message').html('User registered + ' + result);
		        // http://localhost:5000/inbox
            Router.go('go_home_cordova');
		    }
      	});
      }

      console.info('Printing the user-id if any - ' + Meteor.userId());

        return false; 
      }
});


/*** Helpers for cordova login templates ***/
validateUsername = function (username) {
  if (username.length >= 3) {
    return true;
  } else {
    // loginButtonsSession.errorMessage("Username must be at least 3 characters long");
    $('div.error-message').html("Username must be at least 3 characters long");
    return false;
  }
};
validateEmail = function (email) {
  //if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '')
  //  return true;

  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var res = regex.test(email);

  if(!res) {
  	$('div.error-message').html("Invalid email");
    return false;
  }

  return true;

  /**if (email.indexOf('@') !== -1) {
    return true;
  } else {
    // loginButtonsSession.errorMessage("Invalid email");
    $('div.error-message').html("Invalid email");
    return false;
  } **/
};
validatePassword = function (password) {
  if (password.length >= 6) {
    return true;
  } else {
    // loginButtonsSession.errorMessage("Password must be at least 6 characters long");
    $('div.error-message').html("Password must be at least 6 characters long");
    return false;
  }
};