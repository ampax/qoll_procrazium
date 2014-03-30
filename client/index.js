var filename='client/views/index.js';

Template.user_loggedout.events({
	/*'click #login_gh' : function(e, tmpl){
		loginWithService('github');
	},
	'click #login_fb' : function(e, tmpl){
		qlog.info('User login with facebook', filename);
		loginWithService('facebook');
	},
	'click #login_go' : function(e, tmpl){
		qlog.info('User login with google', filename);
	    loginWithService('google');
	},
	'click #login_wb' : function(e, tmpl){
		qlog.info('User login with weibo', filename);
	    loginWithService('weibo');
	}
*/
});

Template.user_loggedin.events({
	'click #logout' : function(event, tmpl) {
		qlog.info('User logout event happened', filename);
	    logoutFromService();
	}
});