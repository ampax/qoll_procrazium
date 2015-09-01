
Template.quicker.helpers({
	inbox_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
});

Template.quicker.rendered = function(){
	$('li#quicker').css('background-color', 'firebrick');
};

Template.quicker.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
	},
});