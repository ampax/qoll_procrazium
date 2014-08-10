var filename='client/views/ckedit/ckEdit.js';

var test_qolls =
"<h1>This is a complex Qoll with _qoll option 1_, _qoll option 2_, _qoll option 3_</h1>"  +

"<ol>"  +
"	<li>complex qoll option one with _some fill in the blanks option_<br />"  +
"	Hint: the value in the middle of underscores will change to fill in the blanks</li>"  +
"	<li>complex qoll option two with more fill in the blanks _fill1_, _123.45_, _1,234.99_<br />"  +
"	Hint: the values in the middle of underscores will change to fill in the blanks<br />"  +
"	Note: the values in the middle of underscores are strongly typed also</li>"  +
"	<li>complex qoll option three with fill in the blanks and multiple choice values _[1,2,3,4]_<br />"  +
"	Note: the multiple options will change in a drop down or radio buttons depending on how many are there</li>"  +
"</ol> "  + 
"<h1>Who is USA current president?</h1>"  +

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