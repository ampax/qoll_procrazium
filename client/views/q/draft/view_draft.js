var filename='client/views/q/sent/view_draft.js';

Template.view_draft.events({
	'click .archive-qoll-btn' : function(event) {
		//event.preventDefault();
		var questid = this._id;
		qlog.info('Clicked to archive this questionnaire ' + questid, filename);
		
		Meteor.call("removeQuestionnaire", questid, function(error, msg) {
			if (error) {
				QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: Error occured while remove the questionaire. Please try again or contact help.');
			} else {
				QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: Removed questionaire from draft.');
			}
		});
	},
	'click .send-qoll-btn' : function(event) {
		//event.preventDefault();
		var questid = this._id;
		qlog.info('Clicked to send this questionnaire ' + questid, filename);
		//return;
		Meteor.call("sendQuestionnaire", questid, function(error, msg) {
			if (error) {
				QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: Error occured while sending the questionaire. Please try again or contact help.');
			} else {
				QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: Removed questionaire from draft.');
			}
		});
	}
});

Template.view_draft.rendered = function(){
	//set background of the rendered box
	$('li#draft').css('background-color', 'firebrick');
};