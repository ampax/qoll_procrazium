Template.qollModalEditor.helpers({

	qollModalEditor : function() {

		return Session.get('QollIdToEdit');
		//var result = Meteor.call('foo', 1, 2);
	}
});
Template.qollModalEditor.events({
	'shown.bs.modal' : function() {
		qlog.info('Modal editor r:'+Session.get('QollRawIdToEdit'));
		Meteor.call('getRawQoll',Session.get('QollRawIdToEdit'), function(err, res){
			if(!err){
				var editor = ace.edit("aceEditor");
				editor.setValue('\# '+res.qollText);
			}
		}); //QollRaw.findOne({id_:Session.get('QollRawIdToEdit')});
		
	}
});
Template.qollModalEditor.rendered = function() {

	/*$('.editor-wrapper').children('.title').hide();
	 $('.modal-content').height('100%');
	 function rescale() {
	 var size = {
	 width : $(window).width() * 0.8,
	 height : $(window).height() * 0.8
	 }
	 // CALCULATE SIZE
	 var offset = 20;
	 var offsetBody = 150;
	 $('.modal-dialog').css('height', size.height - offset);
	 $('.modal-body').css('height', size.height - (offset + offsetBody));
	 //$('#myModal').css('top', 0);
	 }

	 $(window).bind("resize", rescale);
	 rescale();*/
};

