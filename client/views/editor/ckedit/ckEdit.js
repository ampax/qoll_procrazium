var filename='client/views/ckedit/ckEdit.js';

Template.ckEditor.events({
	//TODO
});

Template.ckEditor.rendered = function() {
	qlog.info('Running post rendered code for ckEditor', filename);
	$('textarea#editor').ckeditor();
	/**editor = $('textarea#editor').ckeditor(function(){
	   var $editor = $( 'textarea#editor' );
	   //make sure the wysiwyg editor is prefilled with reactive when first created
	   $editor.val( Session.get('content') );
	});**/
};