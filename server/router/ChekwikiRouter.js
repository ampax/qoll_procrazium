var filename='server/router/ChemwikiRouter.js';


/** Router.map(function(){
	this.route('auget_chemwiki_server', {
		path: '/auget_chemwiki_server',

		action: function () {
		  qlog.info('........ Recieved request to authorize a user from ChemWiki .........', filename);
	      console.log(this.params); //Contains params

	      this.response.writeHead(200, {'Content-Type': 'text/html'});
	      this.response.end('hello from server');
	    },
	});
}); **/

//var chem_wiki_url = 'http://localhost:5000';
var chem_wiki_url = 'http://chemwiki.ucdavis.edu';

Router.route( "auget_chemwiki_server", function() {
	  	var user_f_name = this.params.query.user_f_name;
	  	var user_l_name = this.params.query.user_l_name;
	  	var username = this.params.query.username;
	  	var gender = this.params.query.gender;
	  	var email_id = this.params.query.emailId;

	  	var service = this.params.query.service;
	  	var appId = this.params.query.appId;
	  	var secret = this.params.query.secret;

	  	var created_at = new Date();

	  	qlog.info('service: ' + service + ', appId: ' + appId + ', secret: ' + secret, filename);

	  	var AppNdSecret = ChemwikiAuthorization.ValidateAppNdSecret(service, appId, secret);

	  	if(!AppNdSecret) {
	  		// return empty response and error message
	  		this.response.writeHead('403', {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': chem_wiki_url});
			
			this.response.end(JSON.stringify([{'Error' : 'Your application is not registered with Qoll. Access denied.'}]));
	  	} else {
	  		// process user login request and return a new token
	  		var isValidEmail = EmailValidator.validate(email_id);

		  	//creating the token and adding to the user
			var stampedToken = Accounts._generateStampedLoginToken();
			//hashing is something added with Meteor 0.7.x, 
			//you don't need to do hashing in previous versions
			var hashStampedToken = Accounts._hashStampedToken(stampedToken);

		  	var user_data = {created_at:created_at, hashStampedToken : hashStampedToken, email_id:email_id,
		  				user_f_name:user_f_name, user_l_name:user_l_name, gender:gender};

		  	//preparing the user object to insert into users database
		  	var ud = ChemwikiAuthorization.UserDataSkeleton(user_data);


		  	var jsn = {email_id : email_id, service : service, appId : appId, secret : secret, is_valid : isValidEmail,
		  				created_at : created_at, 'works_or_not' : 'works', 'name' : 'akaushik', 'application' : 'Qoll', 
		  				'message' : 'hello from server'};

		  	qlog.info('Auth request received --- '+ JSON.stringify(jsn), filename);

		  	//////////////////////////////////////////////

		  	var userId = undefined;
		  	var user = ChemwikiAuthorization.ExistingUser(ud); // Meteor.users.findOne({"profile.email" : email_id});
		  	if(!user) {
			    user = ChemwikiAuthorization.CreateNewChemWikiUser(ud);
			    userId = user._id;
			    ChemwikiAuthorization.UpdateLoginToken(userId, hashStampedToken);
			} else {
			    userId = user._id;
			}
			// Meteor.users.update(userId, {$push: {'services.resume.loginTokens': hashStampedToken}});

		  	//////////////////////////////////////////////

		  	var jsonpCallback = this.params.query.jsonpCallback;

		  	// ExtAuth.AuthorizeExternalRequest(this.params.secret, this.params.appId, this.params.emailId);
		  	// 'http://localhost:5000'
			this.response.writeHead('200', {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':  chem_wiki_url});
			
			//this.response.end(JSON.stringify([jsn]));
			var encryptedToken = CryptoJS.AES.encrypt(user.services.chemwiki.accessToken.hashedToken, 'ChemWiki20151220JCM').toString();
			this.response.end(JSON.stringify({token : encryptedToken, 
				when : user.services.chemwiki.accessToken.when, 
				uid : user._id,
				message : 'User account created ... logging in now ...'}));

			Accounts.setPassword(userId, 'chemwikidummypassword');
			// Accounts.setUsername(userId, URLUtil.slugify(user.profile.email))

			return {'name' : 'akaushik', 'application' : 'Qoll'};
	  	}

}, { where: "server" });



var ChemwikiAuthorization = {
	ValidateAppNdSecret : function(service, appId, secret) {
		AppNdSecret = ServiceConfig.find(service, appId, secret);
		return AppNdSecret;
	},
	UserDataSkeleton : function(jsn){
		return {
					createdAt 		: jsn.created_at, 
					email 			: jsn.email_id,
					emails 			: [{address : jsn.email_id, verified : true}],
					username 		: URLUtil.slugify(jsn.email_id),
					// password 		: 'chemwikidummypassword',
					services : {
						'chemwiki' : {
							accessToken 	: jsn.hashStampedToken,
							email 			: jsn.email_id,
							verified_email 	: true,
							name 			: jsn.user_f_name + ' ' + jsn.user_l_name,
							family_name 	: jsn.user_l_name,
							gender 			: jsn.gender,
						},
					},
					profile : {
						name 	: jsn.user_f_name + ' ' + jsn.user_l_name,
						email 	: jsn.email_id,

					},
					registered_emails : [{
						address 	: jsn.email_id,
						verified 	: true,
					}]
				};
	},
	ExistingUser : function(u) {
		var user = Meteor.users.findOne({"profile.email" : u.profile.email});

		return user;
	},
	CreateNewChemWikiUser : function(u) {
		// insert a new user
		//Accounts.createUser( u );
		userId = Meteor.users.insert(u);
		var user = Meteor.users.findOne({"profile.email" : u.profile.email});
		return user;
	},
	UpdateLoginToken : function(userId, token) {
		// reset login tokens first and then update the tokens
		Meteor.users.update({_id: userId},{$set:{"services.resume.loginTokens":[]}});
		// everytime user logs into chem-wiki afresh, refresh/update the token
		Meteor.users.update(userId, {$push: {'services.resume.loginTokens': token}});
		// now reset the chemwiki latest token also
		Meteor.users.update({_id: userId}, {$set: {'services.chemwiki.accessToken': token}});
	},

};