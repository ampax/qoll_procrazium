var filename='client/views/q/chemwiki/chemwiki_homework_box.js';

// var mc = Meteor.npmRequire('moment-countdown');

Template.chemwiki_homework_box.helpers({
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
		qlog.info('===================================== ' + JSON.stringify(questionaire), filename);
		console.log(questionaire.qollstionnaireSubmitted);

		if(questionaire && questionaire.qollstionnaire_closed === 'closed')
			return true;

		if(questionaire && questionaire.qollstionnaireSubmitted === true)
			return true;

		return false;
	},
	is_not_submitted : function(questionaire) {
		qlog.info('=====================================', filename);
		console.log(questionaire.qollstionnaireSubmitted);

		if(questionaire && questionaire.qollstionnaire_closed === 'closed')
			return false;

		if(questionaire && questionaire.qollstionnaireSubmitted === true)
			return false;

		return true;
	},
	is_submitted_caption : function(questionaire) {
		qlog.info('===================================== ' + JSON.stringify(questionaire), filename);
		console.log(questionaire.qollstionnaireSubmitted);

		if(questionaire && questionaire.qollstionnaire_closed === 'closed')
			return "Closed Questionnaire";

		if(questionaire && questionaire.qollstionnaireSubmitted === true)
			return "Submitted Questionnaire";

		return "Unknown";
	},
	is_not_submitted_caption : function(questionaire) {
		qlog.info('=====================================', filename);
		console.log(questionaire.qollstionnaireSubmitted);

		if(questionaire && questionaire.qollstionnaire_closed === 'closed')
			return false;

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
	deadline : function(qollstionnaireDeadline) {
		if(!qollstionnaireDeadline) return '';
		else {
			// return qollstionnaireSubmittedOn;
			// return moment(qollstionnaireDeadline).format('MMM Do YYYY, h:mm a');
			return qollstionnaireDeadline;
		}
	},
});

Template.chemwiki_homework_box.events({
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
	},
	'click button#bkButton' : function(e,t){
		e.preventDefault();
		Router.go('view_inbox_chemwiki');
	},
});

Template.chemwiki_homework_box.rendered = function(){
	$('li#inbox').css('background-color', 'firebrick');
};

Template.chemwiki_homework_box.rendered = function(){
	//set the background of the selected box
	$('li#inbox').css('background-color', 'firebrick');
	//$("#buttons").sticky({topSpacing:70});
	//$("#authorinfo").sticky({topSpacing:160});

	var dt_now = new Date();
	var dt_str = $('#countdown').html();

	if (dt_str === ' ' || dt_str === '') return;

	var dt = new Date(dt_str);
	var dt1 = moment(dt).format('YYYY/MM/DD hh:mm:ss A');

	console.log(dt+'bbbbbbbb'+dt_str+'<-xxxxxxxxxxxxxxxxxxxxxxxxxxx-> '+dt1);

	$('#countdown').countdown(dt1, function(event) {
		if(dt_now > dt){
			$(this).html("<span class='red_1'>Closed: " + dt1+"</span>");
		} else {
			$(this).html(event.strftime("<span class='red_1'>%D days</span> <span class='red_2'>%H:%M:%S</span>"));
		}
	});
	
};
