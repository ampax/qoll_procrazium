var filename = 'client/lib/downtown/DownTownHelper.js';

Handlebars.registerHelper('downtown', function(data, option, escape_mathjax){
	qlog.info("Registering new helper with qpoll@server", filename);

	Meteor.call('downtown', data, option, escape_mathjax, function(err, marked_data){
		if(err) {
			qlog.error('Error occured while running marked on server: ' + err, filename);
		} else {
	        qlog.info('Received marked-response from server: ' + marked_data, filename);
	    }
    });
});