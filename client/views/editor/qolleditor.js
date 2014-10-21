var filename='client/views/editor/qolleditor.js';

Template.qolleditor.rendered = function() {
	qlog.info('Template qolleditor has been rendered', filename);
};

Template.qolleditor.helpers({
	is_adv : function(){
		console.log('Fetching the mode informaiton 1');
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.ADV);
	},
	is_basic : function(){
		console.log('Fetching the mode informaiton 2');
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.BASIC);
		
	},
	is_html : function() {
		console.log('Fetching the mode informaiton 3');
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.HTML);
	}
});

Template.qolleditor.events({
	/**'click .dummy_class' : function(event) {
		event.preventDefault();
		qlog.info('You clicked me dummy!', filename);
	}**/
});