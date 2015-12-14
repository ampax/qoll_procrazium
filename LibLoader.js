var filename='LibLoader.js';

(function() {
	qlog.info('--------------------------------------------------------------', filename);
	require(["lib/QollConstants", "lib/logger"], function(QollConstants, logger){
		qlog.info("............ QollConstants & logger loaded ..............", filename);
	});
})();
