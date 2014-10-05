Template.view_qoll.helpers(
    {qoll_btns : function() {
        return {del:false, edit:false, graph:false, send:false } ;
    }
});

Template.view_qoll.rendered = function() {
	//set the background of the selected box
	$('li#qollshop').css('background-color', 'firebrick');
};