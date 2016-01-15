Template.view_qoll.helpers(
    {qoll_btns : function() {
        return {del:false, edit:false, graph:false, send:false } ;
    }
});

Template.view_qoll.rendered = function() {
	//set the background of the selected box
	$('li#qollshop').css('background-color', 'firebrick');
};

Template.view_qoll.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	},
	'click button#bkButton' : function(e,t){
		e.preventDefault();
		Router.go('all_qolls_folder');
	},
});