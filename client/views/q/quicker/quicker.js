
// var mathjax = Meteor.npmRequire('mathjax');

// Template.quicker.onCreated = window.location.reload(true);

Deps.autorun(function () {
	// window.location.reload(true);
});

Template.quicker.helpers({
	inbox_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
});

Template.quicker.created = function(){
	// window.location.reload(true);
};

Template.quicker.rendered = function(){
	$('li#quicker').css('background-color', 'firebrick');

	// window.location.reload(true);

	//$('body').append('<script type="text/javascript" src="assets/js/cbpAnimatedHeader.js">');
};

Template.quicker.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
	},
});