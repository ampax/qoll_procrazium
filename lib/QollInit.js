var filename="lib/QollInit.js";

QollInit = {};

QollInit.init = function() {
	//Initializing globals
	console.info("Initlaizing qoll with global settings.", filename);
	//Set default local
	//Meteor.setLocale('en');
	Session.set("locale", "en");

	console.info("Global locale - " + Session.get("locale"), filename);
};


if(Meteor.isClient){
	// After Hooks
	QollInit.init();
};