var filename="client/views/body/editor.js";

Template.editor.helpers({
	is_adv : function(){
		return checkEditorMode(QollConstants.EDITOR_MODE.ADV);
	},
	is_basic : function(){
		return checkEditorMode(QollConstants.EDITOR_MODE.BASIC);
		
	},
	is_html : function() {
		return checkEditorMode(QollConstants.EDITOR_MODE.HTML);
	}
});


Template.editor.rendered = function(){
    qlog.info('Running post rendered code for editor', filename);
    //Meteor.subscribe('user-prefs-byname', QollConstants.PREF_KEY.EDITOR_MODE);
};

var checkEditorMode = function(mode) {
	settings = Settings.find({'userId' : Meteor.userId()}).fetch()[0];
	qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
	var flag = settings ? settings.editor_mode && settings.editor_mode === mode : false;
	qlog.info('is_adv - ' + flag);
	return settings ? settings.editor_mode && settings.editor_mode === mode : false;
}
