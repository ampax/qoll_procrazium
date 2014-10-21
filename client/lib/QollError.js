var filename='client/lib/QollError.js';

QollError = {
	error : function(err_msg) {
		//if(timeout === undefined) timeout = 8400;
		var cls = '.err-msg';
		var saved_target = $(cls);
	    saved_target.html(err_msg);
	    saved_target.fadeOut( 8400, 'swing', function(){
	    	saved_target.html('');
	    	saved_target.removeAttr("style");
	    });
	},
	success : function(scs_msg) {
		//if(timeout === undefined) timeout = 8400;
		var cls = '.scs-msg';
		var saved_target = $(cls);
	    saved_target.html(scs_msg);
	    saved_target.fadeOut( 8400, 'swing', function(){
	    	saved_target.html('');
	    	saved_target.removeAttr("style");
	    });
	},
	message : function(msg_typ, content, timeout) {
		if(QollConstants.MSG_TYPE.ERROR === msg_typ)
			QollError.error(content, timeout);
		else if(QollConstants.MSG_TYPE.SUCCESS === msg_typ)
			QollError.success(content, timeout);
	}
};