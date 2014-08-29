Template.view_sent_board.helpers({
	sent_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
});

Template.stats_table.helpers({
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
});

Template.stats_table.rendered = function() {
	$('#example').dataTable();
};