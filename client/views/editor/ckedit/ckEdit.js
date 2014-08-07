var filename='client/views/ckedit/ckEdit.js';

var test_qolls = 
"<h1>Who is USA current president?</h1>" +

"<ol>" +
"	<li>Atal Bihari Bajpayee<br />" +
"	Note: Mr Bajpayee won his prime ministerial seat from Lucknow</li>" +
"	<li>Narendra Modi<br />" +
"	Note: Narendra Modi is from the same party as Mr Bajpayee</li>" +
"	<li>Barack Obama<br />" +
"	Hint: Barack Obama is first african american president of USA</li>" +
"	<li>John Carry<br />" +
"	Hint: Who is this guy?</li>" +
"</ol>" + 

"<h1>Which is fastest?</h1>" +

"<ol>" +
"	<li>Light<br />" +
"	Hint: It shines</li>" +
"	<li>Sound<br />" +
"	Hint: It makes music</li>" +
"	<li>Me<br />" +
"	Hint: ummmm ....</li>" +
"	<li>Myself<br />" +
"	Hint: Me, Myself, and Irene</li>" +
"	<li>Irene<br />" +
"	Hint: Irene runs faster than me</li>" +
"</ol>";

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
};