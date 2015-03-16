
Template.qext_email_board.helpers({
	questionaire : function() {
		return QuestionaireForId.findOne();
	}
});