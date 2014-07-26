var filename="client/views/body/editor.js";

Handlebars.registerHelper("debug", function(optionalValue) { 
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value"); 
    console.log("===================="); 
    console.log(optionalValue); 
  } 
});

Template.editor.helpers({
	is_adv : function(){
		return checkEditorMode(QollConstants.EDITOR_MODE.ADV);
		/**settings = Settings.find({'userId' : Meteor.userId()}).fetch()[0];
		qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
		var flag = settings ? settings.editor_mode && settings.editor_mode === QollConstants.EDITOR_MODE.ADV : false;
		qlog.info('is_adv - ' + flag);
		return settings ? settings.editor_mode && settings.editor_mode === QollConstants.EDITOR_MODE.ADV : false;**/
		/**Meteor.subscribe('UserPrefs', function(){
			var prefs = UserPrefs.find({});
			prefs.map(function(p){
				qlog.info('Printing preference ---------------- ' + p, filename);
			});
			qlog.info('Printing the editor prefenrece - ' + JSON.stringify(prefs.fetch()), filename);

			if(prefs === QollConstants.EDITOR_MODE.ADV) {
				Session.set("editor_mode", UserPrefs.editor_mode);
				return true;
			} else {
				Session.set("editor_mode", QollConstants.EDITOR_MODE.BASIC);
				return false;
			}
		});
		
		Meteor.subscribe("editor_mode", Session.get("editor_mode"));
		return false;**/
	},
	is_basic : function(){
		return checkEditorMode(QollConstants.EDITOR_MODE.BASIC);
		/**settings = Settings.find({'userId' : Meteor.userId()}).fetch()[0];
		qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
		var flag = settings ? settings.editor_mode && settings.editor_mode === QollConstants.EDITOR_MODE.BASIC : false;
		qlog.info('is_adv - ' + flag);
		return settings ? settings.editor_mode && settings.editor_mode === QollConstants.EDITOR_MODE.BASIC : false;**/
		
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
