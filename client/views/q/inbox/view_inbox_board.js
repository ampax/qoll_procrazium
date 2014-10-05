
Template.view_inbox_board.helpers({
	inbox_board_btns : function() {
		return {del:false, edit:false, graph:false, send:false } ;
	},
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	progress : function() {
		return QuestionaireProgress.findOne();
	}
});

Template.view_inbox.rendered = function(){
	$('li#inbox').css('background-color', 'firebrick');
};

Template.view_inbox_board.rendered = function(){
	//set the background of the selected box
	$('li#inbox').css('background-color', 'firebrick');
};

Template.progress_bar.rendered = function(){
	$( "#progressbar" ).progressbar({
      value: 37
    });

    /**if ($(this).scrollTop() > 135) {
	    $('#progressbar').addClass('fixed');
	} else {
	    $('#progressbar').removeClass('fixed');
	}**/

    //$("#progressbar").sticky({topSpacing:0})
};