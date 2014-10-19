var filename='client/lib/QollEditorUtil.js';

QollEditorUtil = {
	checkEditorMode : function(mode) {
		settings = Settings.find({'userId' : Meteor.userId()}).fetch()[0];
		qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
		var flag = settings ? settings.editor_mode && settings.editor_mode === mode : false;
		qlog.info(mode + ' - ' + flag);
		return settings ? settings.editor_mode && settings.editor_mode === mode : false;
	},
	checkAccessMode : function(mode) {
		settings = Settings.find({'userId' : Meteor.userId()}).fetch()[0];
		qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
		var flag = settings ? settings.access_mode && settings.access_mode === mode : false;
		qlog.info(mode + ' - ' + flag);
		return settings ? settings.access_mode && settings.access_mode === mode : false;
	}
};