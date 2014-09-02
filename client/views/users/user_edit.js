var filename = "client/views/users/user_edit.js";

currentUserData = new Meteor.Collection("currentUserData");

Template.user_edit.helpers({
	profileIncomplete : function() {
		return this && !this.loading && !UserUtil.userProfileComplete(this);
	},
	userName : function() {

		return UserUtil.getUserName(this);
	},
	groupMemberships : function() {
		var cu = currentUserData.findOne();
		qlog.info('Printing cu - ' + cu, filename);
		if(cu != undefined || cu == null) {
			return cu.groupMemberships;
		} else {
			undefined;
		}
	},
	userEmail : function() {
		return UserUtil.getEmail(this);
	},
	userBio : function() {
		return UserUtil.getBio(this);
	},
	getTwitter : function() {
		return UserUtil.getTwitterName(this) || "";
	},
	getGitHub : function() {
		return UserUtil.getGitHubName(this) || "";
	},
	getGoogle : function() {
		return UserUtil.getGoogleName(this) || "";
	},
	getFacebook : function() {
		return UserUtil.getFacebookName(this) || "";
	},
	profileUrl : function() {
		return Meteor.absoluteUrl() + "users/" + this.slug;
	},
	hasNotificationsUsers : function() {
		return UserUtil.getUserSetting('notifications.users', '', this) ? 'checked' : '';
	},
	hasNotificationsPosts : function() {
		return UserUtil.getUserSetting('notifications.posts', '', this) ? 'checked' : '';
	},
	hasNotificationsComments : function() {
		return UserUtil.getUserSetting('notifications.comments', '', this) ? 'checked' : '';
	},
	hasNotificationsReplies : function() {
		return UserUtil.getUserSetting('notifications.replies', '', this) ? 'checked' : '';
	},
	isLocale : function(locale) {
    	qlog.info('locale - ' + locale, filename);
		return UserUtil.getLocale(this) === locale ? 'checked' : '';
  	},
  isState: function(state, user) {
    return UserUtil.getState(user) === state.state_code ? 'selected' : '';
  },
  isCountry: function(country, user) {
  		return UserUtil.getCountry(user) === country.country_code ? 'selected' : '';
  	},
  	isSex: function(sex) {
	    return UserUtil.getSex(this) === sex ? 'selected' : '';
	},
	statesForCountry: function(country) {
	    return country === 'USA' ? us_states : undefined;
	},
	countries: function(country) {
	    return countries;
	},
});



Template.user_edit.events({
	'keyup input#group_search': function (e) {
		e.preventDefault();
		var group_search_val = $('#group_search').val();
		qlog.info('Printing group_search_val --->' + group_search_val, filename);
		//Meteor.subscribe('PUBLISH_GROUPS_OF_USER', group_search_val);

	    QollAutoComplete.autocomplete({
		      element: 'input#group_search',       // DOM identifier for the element
		      collection: UserGroups,              // MeteorJS collection object (published object)
		      field: 'author_name',                    // Document field name to search for
		      value: 'groupName',
		      limit: 0,                         // Max number of elements to show
		      sort: { groupName: 1 },
		      mode: 'mono',
		      delimiter: ';'
		    }, 'groupName', 
		    function(data){
		    	return data.groupName + '(' + data.author_email + ')'; 
		    	//TODO
		    });              // Sort object to filter results with
		      //filter: { 'gender': 'female' }}); // Additional filtering
	}, 
	'click #subscribe': function(e) {
		e.preventDefault();
		var group_search_val = $('#group_search').val();
		qlog.info('Subscribing the user to the group - ' + group_search_val, filename);

		var group_search_val_arr = group_search_val.split("(");
		var	group_search_val_arr_1 = group_search_val_arr[1].split(")");
		var group_name = group_search_val_arr[0];
		var author_email = group_search_val_arr_1[0];
		qlog.info('Printing the split value - ' + group_name + '/' + author_email, filename);

		Meteor.call('subscribeToGroup', group_name, author_email, function(err, message) {
			var cls = '.scs-msg';
			var msg;
			if (err) {
				cls = '.err-msg';
				msg = 'Failed subscribing to the group: ' + group_name + '('+ author_email +') ...';
				qlog.error('Failed subscribing to the group: ' + group_name + '('+ author_email +')' + err, filename);
			} else {
				if(HashUtil.checkHash(message, 'err_msg')) {
					//Display the error message
					cls = '.err-msg';
					msg = message.err_msg;
				} else if(HashUtil.checkHash(message, 'scs_msg')) {
					//Display the success message
					cls = '.scs-msg';
					msg = message.scs_msg;
					$("#group_search").val('');
				} else {
					//Display some blah blah to say they succeded
					cls = '.scs-msg';
					msg = 'Subscribed to the group - ' + group_name + ','+ author_email +' ...';
					$("#group_search").val('');
				}
				qlog.info('Subscribed to the group - ' + group_name + ','+ author_email +' ...');
			}
			var saved_target = $(cls);
		    saved_target.html(msg);
		    saved_target.fadeOut( 8400, 'swing', function(){
		    	saved_target.html('');
		    	saved_target.removeAttr("style");
		    });
		});
	},
	'submit form' : function(e) {
		e.preventDefault();

		//clearSeenErrors();
		if (!Meteor.user())
			throwError(i18n.t('You must be logged in.'));

    qlog.info('Printig e.target - ' + e.target, filename);

		var $target = $(e.target);
		var name = $target.find('[name=name]').val();
		var user = this;
		var update = {
			"profile.name" : name,
			"profile.name_slug" : URLUtil.slugify(name),
			"profile.slug" : URLUtil.slugify($target.find('[name=username]').val()),
			"profile.bio" : $target.find('[name=bio]').val(),
			"profile.email" : $target.find('[name=email]').val(),
			"profile.twitter" : $target.find('[name=twitter]').val(),
			"profile.google" : $target.find('[name=google]').val(),
			"profile.facebook" : $target.find('[name=facebook]').val(),
			"profile.github" : $target.find('[name=github]').val(),
			"profile.site" : $target.find('[name=site]').val(),
			"profile.locale" : $('input[name=locale]:checked').val(),

      "profile.dob": $target.find('input[name=dob]').val(),
      "profile.sex": $("select#sex option:selected").val(),
      "profile.state": $('select#state option:selected').val(),
      "profile.country": $('select#country option:selected').val(),
			//"profile.notifications.users": $('input[name=notifications_users]:checked').length, // only actually used for admins
			//"profile.notifications.posts": $('input[name=notifications_posts]:checked').length,
			//"profile.notifications.comments": $('input[name=notifications_comments]:checked').length,
			//"profile.notifications.replies": $('input[name=notifications_replies]:checked').length,
			"inviteCount" : parseInt($target.find('[name=inviteCount]').val())
		};

    qlog.info(update);

		var old_password = $target.find('[name=old_password]').val();
		var new_password = $target.find('[name=new_password]').val();

		if (old_password && new_password) {
			Accounts.changePassword(old_password, new_password, function(error) {
				if (error)
					//throwError(error.reason);
					qlog.error('Error occured while changing password - ' + error.reason, filename);
			});
		}

		Meteor.users.update(user._id, {
			$set : update
		}, function(error) {
			if (error) {
				//throwError(error.reason);
				qlog.error('Error happened while saving - ' + error.reason, filename);
			} else {
				//throwError(i18n.t('Profile updated'));
				qlog.error('User data saved', filename);
			}
			Deps.afterFlush(function() {
				//var element = $('.grid > .error');
				//$('html, body').animate({scrollTop: element.offset().top});
			});
		});
	},
	'click .addgroupbtn' : function(e) {
		e.preventDefault();
		var gpandowner = prompt("Please enter groupName,ownerEmail", "");
		if (gpandowner != null) {
			var parts = gpandowner.split(',');
			if (parts.length == 2) {
				if (parts[0].trim() && parts[1].trim()) {
					Meteor.call('userAddGroupMembership', parts[0].trim(), parts[1].trim());
				}
			} else {
				alert("Enter only groupName and groupOwnerEmail seperated by a comma eg publicgroup,user@qoll.io");
			}
			alert("Request sent refresh page to confirm new group membership");
			//

		}
	}
}); 

Template.user_edit.rendered = function() {
	qlog.info("Initializing autocomplete ... ", filename);
	Meteor.subscribe('PUBLISH_GROUPS_OF_USER_1');
	QollAutoComplete.init("input#group_search");
	QollAutoComplete.enableLogging = true;
};


Template.user_subscribed_groups.helpers({
	groupMemberships : function(){
		return UserSubscGroups.find({});
	}
});


Template.user_edit.rendered = function(){
    $( "#dob" ).datepicker();
};

