var filename='server/lib/EmailValidator.js';

Future = Npm.require('fibers/future');

EmailValidator = {
	validate : function(email_id) {
		// validateEmail = new Future();
		return true; // for now we consider that emails coming from chemwiki are legitimate
	}
};