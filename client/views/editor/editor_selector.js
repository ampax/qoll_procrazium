var filename='client/views/editor/editor_selector.js';

Template.editor_selector.helpers({
	is_adv : function(){
		return checkEditorMode(QollConstants.EDITOR_MODE.ADV) ? 'checked' : '';
	},
	is_basic : function(){
		return checkEditorMode(QollConstants.EDITOR_MODE.BASIC) ? 'checked' : '';
		
	},
	is_html : function() {
		return checkEditorMode(QollConstants.EDITOR_MODE.HTML) ? 'checked' : '';
	}
});

Template.editor_selector.events({
	"click input[name = 'editorPref']" : function(event) {
		var editor_choice = $('input[name=editorPref]:checked').val();
		if(editor_choice == undefined || editor_choice == '') {
			editor_choice = QollConstants.EDITOR_MODE.BASIC; //default the editor choice to basic
		}
		qlog.info('Switching to editor mode - ' + editor_choice, filename);
		
		settings = Settings.find({'userId' : Meteor.userId()}).fetch();
	    if(settings && settings.length > 0) {
	      //Settings.update({'editor_mode': QollConstants.EDITOR_MODE.BASIC});
	      /**
	      QollConstants.EDITOR_MODE.BASIC - basic
	      QollConstants.EDITOR_MODE.ADV - advanced (used for markdown now)
	      QollConstants.EDITOR_MODE.HTML - html
	      **/

	      Settings.update({_id : settings[0]._id}, {
	        $set: {'editor_mode': editor_choice}
	      }, function(error){
	        if(error){
	          //throwError(error.reason);
	          qlog.error('Error happened while saving editor-preferences '+editor_choice+', error - '+error.reason, filename);
	        } else {
	          qlog.info('Saved editor_mode = '+editor_choice+' to preferences', filename);
	        }
	      });
	    } else {
	        Settings.insert({'userId' : Meteor.userId(), 'editor_mode': QollConstants.EDITOR_MODE.BASIC});
	    }
	}
});

Template.editor_selector.rendered = function() {
}


var checkEditorMode = function(mode) {
	settings = Settings.find({'userId' : Meteor.userId()}).fetch()[0];
	qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
	var flag = settings ? settings.editor_mode && settings.editor_mode === mode : false;
	qlog.info('is_adv - ' + flag);
	return settings ? settings.editor_mode && settings.editor_mode === mode : false;
}