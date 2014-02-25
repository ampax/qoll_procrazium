filename = 'lib/logger.js';
SITE_URL = Meteor.absoluteUrl();

qlog = Observatory.getToolbox();

if(SITE_URL.search(/herokuapp/) != -1) {
	console.log("Setting the log level to WARN for qoll-io " + SITE_URL);
	var settings = {
	    maxSeverity: "WARN",
	    printToConsole: false, // whether to also log to console
	    logUser: true, // log the user information?
	    logHttp: true, // log http requests automagically?
	    logDDP: false, // log DDP requests automagically?
	};
	Observatory.setSettings(settings);
} else {
	console.log("Setting the log level to INFO for localhost " + SITE_URL);
	var settings = {
	    maxSeverity: "INFO",
	    printToConsole: true, // whether to also log to console
	    logUser: true, // log the user information?
	    logHttp: true, // log http requests automagically?
	    logDDP: false, // log DDP requests automagically?
	};
	Observatory.setSettings(settings);
}
