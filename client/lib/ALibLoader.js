var filename='ALibLoader.js';

// Required to load the library before Routers are initialized

(function() {
	console.log('==================================================================', filename);
	require(["lib/QollConstants", "lib/logger"], function(QollConstants, logger){
		qlog.info("............ QollConstants & logger loaded ..............", filename);
	});
})();