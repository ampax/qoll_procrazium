Template.view_sent_board.helpers({
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
});

Template.view_sent_board_results.helpers({
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
});

Template.view_sent_board_results.events({
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
				//$('h5#submitted'+email_id).html('');
			}
		});
	}
});

Template.stats_table.helpers({
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	qoll_list : function() {
		return QollForQuestionaireId.find({_id : Session.get('questionnaire_id')}).fetch()[0];
	}
});

Template.stats_table.rendered = function() {
	$('#example').dataTable();
};

Template.view_sent_board.rendered = function(){
	//set the background of the selected box
	$('li#sent').css('background-color', 'firebrick');
};