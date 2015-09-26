
Template.qext_wall_board.helpers({
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	qollQuestionnaire : function() {
		return {};
	}
});