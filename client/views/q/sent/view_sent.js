var filename='client/views/q/sent/view_sent.js';

Template.view_sent.events({
	'click .archive-qoll-btn' : function(event) {
		event.preventDefault();
		var questid = this._id;
		qlog.info('Clicked to archive this questionnaire ' + questid, filename);
		
		Meteor.call("removeQuestionnaire", questid, function(error, msg) {
			if (error) {
				QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: Error occured while remove the questionaire. Please try again or contact help.');
			} else {
				QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: Removed questionaire.');
			}
		});
	},
	'click .sendemail' : function(event) {
		//event.preventDefault();
		var questid = this._id;
		qlog.info('Clicked to resend email this questionnaire ' + questid, filename);
		// Will be sending the emails on the server side
		Meteor.call('sendQollstionnaireMail', questid, function(err, data) {
          if (err) {
            qlog.info('Failed sending the email - ' + questid + '/' + err, filename);
          } else {
            qlog.info('Sent the email - ' + questid + ', message - ' + data, filename);
          }
        });
	},
});

Template.view_sent.rendered = function(){
	//set the background of the selected box.
	$('li#sent').css('background-color', 'firebrick');
};