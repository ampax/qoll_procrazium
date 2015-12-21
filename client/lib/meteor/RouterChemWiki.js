var filename='client/lib/meteor/RouterChemWiki.js';


Router.map(function(){
	this.route('auget_chemwiki', {
		path: '/auget_chemwiki',

		action: function () {
			qlog.info('........ Recieved request to authorize a user from ChemWiki .........', filename);
	    	// console.log(this.params); //Contains params

	    	ExtAuth.AuthorizeExternalRequest(this.params.secret, this.params.appId, this.params.emailId);

	    	/** Meteor.call('authorizeExternalRequest', this.params.secret, this.params.appId, this.params.emailId, function(err, response) {
				if (err) {
					qlog.info('Failed while authorizing the user - ' + err, filename);
				} else {
					qlog.info('Authorizing the user with response - ' + response, filename);
				}
			}); **/

	    	// this.response.writeHead(200, {'Content-Type': 'text/html'});
	    	// console.log(this.response, filename);

	    	this.response.write("works");

	    	this.response.write(JSON.stringify({'name' : 'akaushik', 'application' : 'Qoll'}));

	    	this.response.end('hello from server');

	    	return {'name' : 'akaushik', 'application' : 'Qoll'};
	    }
	});


	this.route('auget_chemwiki_login', {
		template : 'auget_chemwiki_login',
		path: '/auget_chemwiki_login/:token',

		action : function() {
			var token = this.params.token;
			token = decodeURIComponent(token);

			Meteor.call("findUserByToken", token, function(err, usr) {
				if(err) {
					qlog.info('Error happened while getting user information using token - ' + err + '/' + token, filename);
				} else {
					Meteor.loginWithPassword(usr.email, usr.password, function(err1){
						if(err1) {
							qlog.info('Error happened while logging in the user - ' + err1, filename);
						} else {
							qlog.info('Welcome chemwiki user ...', filename);
							Router.go('landing');
						}
					});
				}
			});

		}
	});
});