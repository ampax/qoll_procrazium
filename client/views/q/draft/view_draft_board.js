Template.view_draft_board.helpers({
	draft_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	questionaire : function() {
		return QuestionaireForId.findOne();
	}
});

Template.view_draft_board.rendered = function(){
	//set the background of the rendered box
	$('li#draft').css('background-color', 'firebrick');
};


Template.view_draft_board.events({
	'click button#bkButton' : function(e,t){
		e.preventDefault();
		Router.go('view_draft');
	},
});
