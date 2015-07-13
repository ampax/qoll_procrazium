var filename='views/q/comments/qoll_comments.js';

Template.qoll_comments.helpers({
	commented_on : function(commentedOn) {
		qlog.info('Commented on : ' + commentedOn, filename);
		if(commentedOn) {
			// return qollstionnaireSubmittedOn;
			return "(On: "+moment(commentedOn).format('MMM Do YYYY, h:mm a')+")";
		}
	},
});

Template.qoll_comments.events({
	'keydown .qoll_comments' : function(e, t) {
		//qlog.info('Typing in the qoll-comment ' + this._id, filename);

		var text_max = 160;

		var text_length = $('#qoll_comments'+this._id).val().length;
        var text_remaining = text_max - text_length;

        $('#textarea_feedback'+this._id).html(text_remaining + ' characters remaining');
	},
	'keyup .qoll_comments' : function(e, t) {
		//qlog.info('Adding the comment now - ', filename);

		if(event.which === 13 && !event.shiftKey){
	      // submit your comment via AJAX or anything you like
	      var qoll_comments_text = $('#qoll_comments'+this._id).val();
	      qlog.info('Submitting the comment now ... ' + qoll_comments_text, filename);

	      var _qollstionnaireid = this._qollstionnaireid;

	      $('#qoll_comments'+this._id).val('');
	      $('#textarea_feedback'+this._id).html('160 characters remaining');
	      
	      Meteor.call('update_questionnaire_comment', _qollstionnaireid, this._id, undefined, qoll_comments_text, function(err, res){
				if(err) {
					qlog.error('Error happened while updating comment for  ... questId: ' + _qollstionnaireid + ', qollId: ' + this._id, filename);
					qlog.error(err, filename);
				} else {
					// alert('Stored the comment - ' + qoll_comments_text);
				}
			});
	    }
	},
});