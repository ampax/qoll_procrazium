var filename='client/views/q/inbox/view_inbox_board.js';

Template.view_inbox_board.helpers({
	inbox_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	progress : function() {
		return QuestionaireProgress.findOne();
	},
	is_submitted : function(questionaire) {
		qlog.info('=====================================', filename);
		console.log(questionaire.qollstionnaireSubmitted);
		if(questionaire && questionaire.qollstionnaireSubmitted === true)
			return true;

		return false;
	},
	is_not_submitted : function(questionaire) {
		qlog.info('=====================================', filename);
		console.log(questionaire.qollstionnaireSubmitted);
		console.log(questionaire.qollstionnaireSubmitted === true);
		if(questionaire && questionaire.qollstionnaireSubmitted === true)
			return false;

		return true;
	},
	created_on : function(qollstionnaireCreatedOn) {
		// console.log(qollstionnaireCreatedOn);

		if(!qollstionnaireCreatedOn) return '';
		else {
			// return qollstionnaireSubmittedOn;
			return moment(qollstionnaireCreatedOn).format('MMM Do YYYY, h:mm a');
		}
	},
});

Template.view_inbox_board.events({
	'click button#submit_questionnaire' : function(e, t) {
		e.preventDefault();
		qlog.info('Clicked to submit questionnaire .. will be confirming now', filename);
		$('.row-submit').addClass('is-invisible');
		$('.row-confirm').removeClass('is-invisible');

		// update the questionnaire and freeze it now
	},
	'click button#cancel_submission' : function(e, t) {
		e.preventDefault();
		qlog.info('Clicked to submit questionnaire .. will be confirming now', filename);
		$('.row-confirm').addClass('is-invisible');
		$('.row-submit').removeClass('is-invisible');
	},
	'click button#confirm_submission' : function(e, t) {
		e.preventDefault();
		qlog.info('Confirming the questionnaire now ... ', filename);
		var btn = $(e.target);

		var quest_id = btn.data('questionaire_id');
		var user_id = Meteor.userId();

		qlog.info(quest_id + '/' + user_id, filename);
		console.log(e);
		console.log(btn.data('questionaire_id'));

		Meteor.call('submit_questionnaire', quest_id, user_id, function(err, res){
			if(err) {
				qlog.error('Error happened while submitting the questionnaire ... ' + quest_id, filename);
				qlog.error(err, filename);
			} else {
				alert(res.msg);
			}
		});


		$('.row-confirm').addClass('is-invisible');
		$('.row-submit').addClass('is-invisible');
		$('.row-submitted').removeClass('is-invisible');
	},
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
	}
});

Template.view_inbox.rendered = function(){
	$('li#inbox').css('background-color', 'firebrick');
};

Template.view_inbox_board.rendered = function(){
	//set the background of the selected box
	$('li#inbox').css('background-color', 'firebrick');
	//$("#buttons").sticky({topSpacing:70});
	//$("#authorinfo").sticky({topSpacing:160});
	
};

Template.progress_bar.rendered = function(){
	$( "#progressbar" ).progressbar({
      value: 37
    });

    /**if ($(this).scrollTop() > 135) {
	    $('#progressbar').addClass('fixed');
	} else {
	    $('#progressbar').removeClass('fixed');
	}**/

    //$("#progressbar").sticky({topSpacing:0})
};