var filename="client/views/body/qolleditor_adv_edit.js";

Template.qolleditor_adv_edit.rendered = function() {
	qlog.info('adding dummy text for editting', filename);
	if(Session.get("qollRawId") != null) {
		//Load the editor in update mode.
		//var editor = ace.edit("aceEditor");
	    //var qoll_editor_content = editor.getValue();
	    //var recips = jQuery("input#recipient_search").val();
	    editor.setValue("Adding the to be updated content here ...", -1)
	}
	
  //initEditor(editor);
};