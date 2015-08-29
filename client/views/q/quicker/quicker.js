
Template.quicker.helpers({
	inbox_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
});

Template.quicker.rendered = function(){
	$('li#quicker').css('background-color', 'firebrick');
};