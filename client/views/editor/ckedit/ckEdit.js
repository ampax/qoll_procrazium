var filename='client/views/ckedit/ckEdit.js';

var test_qolls = 
"<h1>Who is USA current president?</h1>"+

"<ol>"+
"	<li>Atal Bihari Bajpayee<br />"+
"	Note: Mr Bajpayee won his prime ministerial seat from Lucknow</li>"+
"	<li>Narendra Modi<br />"+
"	Note: Narendra Modi is from the same party as Mr Bajpayee</li>"+
"	<li>Barack Obama<br />"+
"	Hint: Barack Obama is first african american president of USA</li>"+
"	<li>John Carry<br />"+
"	Hint: Who is this guy?</li>"+
"</ol>";

;

Template.ckEditor.helpers({
	dev_text : function() {
		if(URLUtil.isDev()) {
			return test_qolls;
		}

		return 'Some text';
	}
});

Template.ckEditor.events({
	//TODO
});

Template.ckEditor.rendered = function() {
	qlog.info('Running post rendered code for ckEditor', filename);

	var editor = $('textarea#editor').ckeditor();

	CKEDITOR.replace( 'textarea#editor', {
		extraPlugins: 'mathjax'
	} );

	
	/**editor = $('textarea#editor').ckeditor(function(){
	   var $editor = $( 'textarea#editor' );
	   //make sure the wysiwyg editor is prefilled with reactive when first created
	   $editor.val( Session.get('content') );
	});**/
};