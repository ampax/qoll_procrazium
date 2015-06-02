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