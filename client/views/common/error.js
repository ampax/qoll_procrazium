var filename='client/views/common/error.js';

Error = {
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
			Error.error(content, timeout);
		else if(QollConstants.MSG_TYPE.SUCCESS === msg_typ)
			Error.success(content, timeout);
	}
};

Template.error.rendered = function(){
    qlog.info('Running post rendered code for editor 888', filename);
    //Meteor.subscribe('user-prefs-byname', QollConstants.PREF_KEY.EDITOR_MODE);
    if(URLUtil.isDev()) {
	    //Error.message(QollConstants.MSG_TYPE.ERROR, 'Use me to show error messages: Error.message(\'error\', msg);', 6000);
	    //Error.message(QollConstants.MSG_TYPE.SUCCESS, 'Use me to show success messages: Error.message(\'success\', msg);', 6000);
	}
};