filename = 'lib/logger.js';
SITE_URL = Meteor.absoluteUrl();

LOG_SEVERITY = {'OFF' : -1, 'DEBUG' : 4, 'INFO' : 3, 'WARN' : 2, 'ERROR' : 1, 'FATAL' : 0 }

var settings;

if(SITE_URL.search(/qoll\.io/) != -1 || SITE_URL.search(/qoll-s\.herokuapp\.com/) != -1) {
	console.log("Setting the log level to ERROR for qoll-io " + SITE_URL);
	settings = {
	    maxSeverity: "WARN",
	    severity : 2,
	    printToConsole: false, // whether to also log to console
	    logUser: true, // log the user information?
	    logHttp: true, // log http requests automagically?
	    logDDP: false, // log DDP requests automagically?
	};
	//Observatory.setSettings(settings);
} else {
	console.log("Setting the log level to WARN for localhost " + SITE_URL);
	settings = {
	    maxSeverity: "INFO",
	    severity : 3,
	    printToConsole: true, // whether to also log to console
	    logUser: true, // log the user information?
	    logHttp: true, // log http requests automagically?
	    logDDP: false, // log DDP requests automagically?
	};
	//Observatory.setSettings(settings);
}

//var lgr = Observatory.getToolbox();
var lgr = console;
qlog = {
	debug : function(log, filename) {
		if(settings.severity >=4) console.debug(log, filename); //lgr.debug(log, filename);
	},
	info : function(log, filename) {
		if(settings.severity >= 3) console.info(log, filename); //lgr.info(log, filename);
	},
	warn : function(log, filename) {
		if(settings.severity >=2) console.warn(log, filename); //lgr.warn(log, filename);
	},
	error : function(log, filename) {
		if(settings.severity >= 1) console.error(log, filename); //lgr.error(log, filename);
	},
	fatal : function(log, filename) {
		if(settings.severity >= 0) console.error(log, filename); //lgr.fatal(log, filename);
	},
};

/** Customized pince implementation **/
var PinceLogger = (function() {
})();