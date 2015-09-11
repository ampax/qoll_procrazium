Template.qoll_detail_explanation.events({
	'keydown .qoll_detail' : function(e, t) {
		//qlog.info('Typing in the qoll-comment ' + this._id, filename);

		var text_max = 1000;

		var text_length = $('#qoll_detail'+this._id).val().length;
        var text_remaining = text_max - text_length;

        $('#textarea_feedback'+this._id).html(text_remaining + ' characters remaining');
	},
	'keyup .qoll_detail' : function(e, t) {
		//qlog.info('Adding the comment now - ', filename);

		if(e.which === 13 && !e.shiftKey){
	      // submit your comment via AJAX or anything you like
	      var qoll_comments_text = $('#qoll_detail'+this._id).val();
	      var _qollstionnaireid = this._qollstionnaireid;

	      if(! _qollstionnaireid ) {
	      	//alert('Comments for qolls not enabled yet.');
	      	return false;
	      }

	      $('#qoll_detail'+this._id).val('');
	      $('#textarea_feedback'+this._id).html('1000 characters remaining');

	      qlog.info('Submitting the comment now ... comment: ' + qoll_comments_text + ', qid: ' + this._id + 
	      	', questionnaire-id: ' + _qollstionnaireid, filename);
	      
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