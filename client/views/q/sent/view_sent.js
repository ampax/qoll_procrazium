var filename='client/views/q/sent/view_sent.js';

Template.view_sent.helpers({
  closed_on : function(closed_on) {
  		if(closed_on && closed_on.closed_on) {
			// return qollstionnaireSubmittedOn;
			return "<span class='red_1'>"+moment(closed_on.closed_on).format('MMM Do YYYY, h:mm a')+"</span>";
		}
	},
});

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
	// URLUtil.SITE_URL+'ext_email_board/'+user_q_uuid+'/'+id+'/'+email+'/email
	// http://localhost:5000/ext_email_board/5e0714a7-1d59-480f-9c77-372fc68ea4f8/F2pPoF6rzdR3ZFZLY/kaushik.anoop@gmail.com/embed
	// /ext_embed_board/:_id/:email_id/:qoll_portal
	'click .copy-link' : function(event) {
		//event.preventDefault();
		var questid = this._id;
		var embeddable_url = URLUtil.SITE_URL+'ext_embed_board/'+questid+'/user_emailid/embed';
		qlog.info('Clicked to copy link for this questionnaire ' + questid, filename);
		// alert(embeddable_url);
		prompt("Copy and embed the link", embeddable_url);
		//$(event.target).popover();
		// return embeddable_url;
	},
});

Template.view_sent.rendered = function(){
	//set the background of the selected box.
	$('li#sent').css('background-color', 'firebrick');
};