var filename='client/views/q/sent/view_sent.js';

Template.view_sent.events({
	'click .archive-qoll-btn' : function(event) {
		event.preventDefault();
		var questid = this._id;
		qlog.info('Clicked to archive this questionnaire ' + questid, filename);
		
		Meteor.call("removeQuestionnaire", questid, function(error, msg) {
			if (error) {
				Error.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: Error occured while remove the questionaire. Please try again or contact help.');
			} else {
				Error.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: Removed questionaire.');
			}
		});
	}
});