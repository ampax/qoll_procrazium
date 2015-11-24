var filename='client/views/editor/editor_selector.js';

Template.editor_selector.helpers({
	is_adv : function(){
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.ADV) ? 'checked' : '';
	},
	is_basic : function(){
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.BASIC) ? 'checked' : '';
		
	},
	is_html : function() {
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.HTML) ? 'checked' : '';
	},
	is_template : function() {
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.TEMPLATE) ? 'checked' : '';
	},
	is_mathjax : function() {
		qlog.info('Called ...... is_mathjax', filename);
		return QollEditorUtil.checkTexMode(QollConstants.TEX_MODE.MATHJAX) ? 'checked' : '';
	},
	is_katex : function() {
		qlog.info('Called ...... is_katex', filename);
		return QollEditorUtil.checkTexMode(QollConstants.TEX_MODE.KATEX) ? 'checked' : '';
	}
});

Template.editor_selector.events({
	"click input[name = 'editorPref']" : function(event) {
		event.preventDefault();
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
	        Settings.insert({'userId' : Meteor.userId(), 'editor_mode': editor_choice});
	    }
	},
	"click input[name = 'texPref']" : function(event) {
		console.info('ddddddddddddidnt get this ... grrrrrrrr');
		event.preventDefault();
		var tex_pref = $('input[name=texPref]:checked').val();
		if(tex_pref == undefined || tex_pref == '') {
			tex_pref = QollConstants.TEX_MODE.MATHJAX; //default the tex to mathjax
		}
		qlog.info('Switching to tex mode - ' + tex_pref, filename);
		
		settings = Settings.find({'userId' : Meteor.userId()}).fetch();
	    if(settings && settings.length > 0) {
	      //Settings.update({'editor_mode': QollConstants.EDITOR_MODE.BASIC});
	      /**
	      QollConstants.EDITOR_MODE.BASIC - basic
	      QollConstants.EDITOR_MODE.ADV - advanced (used for markdown now)
	      QollConstants.EDITOR_MODE.HTML - html
	      **/

	      Settings.update({_id : settings[0]._id}, {
	        $set: {'tex_pref': tex_pref}
	      }, function(error){
	        if(error){
	          //throwError(error.reason);
	          qlog.error('Error happened while saving tex-preferences '+tex_pref+', error - '+error.reason, filename);
	        } else {
	          qlog.info('Saved tex_pref = '+tex_pref+' to preferences', filename);
	        }
	      });
	    } else {
	        Settings.insert({'userId' : Meteor.userId(), 'tex_pref': tex_pref});
	    }
	}
});

Template.editor_selector.rendered = function() {
}

