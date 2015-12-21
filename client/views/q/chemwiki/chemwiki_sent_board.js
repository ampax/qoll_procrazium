Template.chemwiki_sent_board.helpers({
	sent_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	is_quicker : function(category) {
		return category === 'quicker';
	},
	is_not_quicker : function(category) {
		return !(category === 'quicker');
	},
	qoll_list : function() {
		return QollForQuestionaireId.find({_id : Session.get('questionnaire_id')}).fetch()[0];
	},
	can_close : function(questionnaire) {
		console.log('================================' + (questionnaire && questionnaire.qollstionnaire_closed === 'closed'));
		console.log(questionnaire);
		console.log('================================' + (questionnaire && questionnaire.qollstionnaire_closed != 'closed'));
		if(questionnaire && questionnaire.qollstionnaire_closed === 'closed') {
			return 'is-invisible';
		}
	},
	is_closed : function(questionnaire) {
		if(questionnaire && questionnaire.qollstionnaire_closed != 'closed') {
			return 'is-invisible';
		}
	},
	closed_on : function(questionnaire) {
		if(questionnaire && questionnaire.qollstionnaire_closed === 'closed') {
			// return qollstionnaireSubmittedOn;
			return "(Closed On: "+moment(questionnaire.qollstionnaire_closed_on).format('MMM Do YYYY, h:mm a')+")";
		}
	},

	
});

Template.chemwiki_sent_board.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	},
	'click button#close_questionnaire' : function(e, l) {
		e.preventDefault();

		var btn = $(e.target);

		var quest_id = btn.data('questionaire_id');
		var user_id = Meteor.userId();

		qlog.info('------------------------ closing ------- ' + quest_id+ '/' + user_id, filename);

		Meteor.call('close_questionnaire', quest_id, user_id, function(err, res){
			if(err) {
				qlog.error('Error happened while submitting the questionnaire ... ' + quest_id, filename);
				qlog.error(err, filename);
			} else {
				alert(res.msg);
			}
		});
	},
	'click button#bkButton' : function(e,t){
		e.preventDefault();
		qlog.info('Navigating to sent-qolls now', filename);
		Router.go('view_sent_chemwiki');
	},
});

Template.chemwiki_view_sent_board_results.helpers({
	submitted_on : function(qollstionnaireSubmittedOn) {
		if(!qollstionnaireSubmittedOn) return '';
		else {
			// return qollstionnaireSubmittedOn;
			return moment(qollstionnaireSubmittedOn).format('MMM Do YYYY, h:mm a');
		}
	},
	resend_submitted : function(qollstionnaireSubmittedOn, questionaireId, email) {
		qlog.info('==============================>'+questionaireId, filename);
		if(!qollstionnaireSubmittedOn) return '';
		else {
			// return qollstionnaireSubmittedOn;
			return "<a class='resend_submitted_questionnaire' "+
			"style='color: white; cursor:pointer;' data-questionaire_id='"+questionaireId+
			"' data-email_id='"+ email +"'>Resend</a>";
		}
	},
	transform_txt : function(txt, cat, context, fib, tex) {
	  var txt_1 = transform_fib(txt, cat, context, fib); // coming from preview.js

	  var txt_2 = transform_tex(txt_1, tex); // coming from preview.js

	  return txt_2;
	},
});

Template.chemwiki_view_sent_board_results.events({
	'click .resend_submitted_questionnaire' : function(e, t) {
		//Call the open again questionnaire so that the recip cak make changes again
		var lnk = $(e.target);
		var quest_id = lnk.data('questionaire_id');
		var email_id = lnk.data('email_id');

		qlog.info(quest_id + '/' + email_id, filename);

		Meteor.call('resend_submitted_questionnaire', quest_id, email_id, function(err, res){
			if(err) {
				qlog.error('Error happened while submitting the questionnaire ... ' + quest_id, filename);
				qlog.error(err, filename);
			} else {
				alert('Resend complete ...');
				lnk.html('');
				//$('h5#submitted'+email_id).html('');lnk.
			}
		});
	},
});

Template.chemwiki_stats_table.helpers({
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	qoll_list : function() {
		return QollForQuestionaireId.find({_id : Session.get('questionnaire_id')}).fetch()[0];
	}
});

Template.chemwiki_stats_table.rendered = function() {
	$('#example').dataTable();
};
