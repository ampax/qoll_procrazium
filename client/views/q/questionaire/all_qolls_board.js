

Template.all_qolls_board.events({
	'click button#bkButton' : function(e,t){
		e.preventDefault();
		Router.go('all_qolls');
	},
});
