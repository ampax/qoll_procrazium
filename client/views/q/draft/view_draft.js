var filename='client/views/q/sent/view_draft.js';

Template.view_draft.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	},
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
		// Will be sending the emails on the server side
		Meteor.call("sendQuestionnaire", questid, function(error, msg) {
			if (error) {
				QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: Error occured while sending the questionaire. Please try again or contact help.');
			} else {
				QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: Removed questionaire from draft.');

				// Sending an email to the recepients now
				Meteor.call('sendQollstionnaireMail', questid, function(err, data) {
		          if (err) {
		            qlog.info('Failed sending the email - ' + questid + '/' + err, filename);
		          } else {
		            qlog.info('Sent the email - ' + questid + ', message - ' + data, filename);
		          }
		        });
			}
		});
	}
});

Template.view_draft.rendered = function(){
	//set background of the rendered box
	$('li#draft').css('background-color', 'firebrick');
};