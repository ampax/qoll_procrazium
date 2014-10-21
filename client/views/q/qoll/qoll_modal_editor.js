var filename='client/views/q/qoll/qoll_modal_editor.js';

Template.model_editor.helpers({
	is_adv : function(){
		qlog.info('Getting the type here ...', filename);
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.ADV);
	},
	is_basic : function(){
		qlog.info('Getting the type here ...', filename);
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.BASIC);
		
	},
	is_html : function() {
		qlog.info('Getting the type here ...', filename);
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.HTML);
	}
});

Template.qollModalEditor.helpers({
	is_adv : function(){
		qlog.info('Getting the type here ...', filename);
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.ADV);
	},
	is_basic : function(){
		qlog.info('Getting the type here ...', filename);
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.BASIC);
		
	},
	is_html : function() {
		qlog.info('Getting the type here ...', filename);
		return QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.HTML);
	}
});

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
			qlog.info('Result recieved xxx - original-format: ' + res.qollFormat + ', tags: ' + res.tags + ', qoll-text: ' + res.qollText, filename);
				if(!err){
					if(QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.HTML)) {
						//Check for the original format of the qoll here and do the conversion if required

						qlog.info('Result recieved - original-format: ' + res.qollFormat + ', qoll-text: ' + res.qollText, filename);
						$('textarea#editor').val(res.qollText);
						var editor = $('textarea#editor').ckeditor();
						$('#tags').val(res.tags.join(' '));
						//var editor = $('textarea#editor').ckeditor();
						//$('#editor').val('');
						//CKEDITOR.instances.editor.insertHtml( '<p>This is a new paragraph.</p>' );
						//$('#editor').val(res.qollText);
						//editor.insertHtml(res);
					} else if(QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.ADV)) {
						var editor = ace.edit("aceEditor");
						editor.setValue('\# '+res.qollText);
					}
			} else {
				qlog.info('Eror happened - ' + err);
			}
		}); //QollRaw.findOne({id_:Session.get('QollRawIdToEdit')});
		
	},
	'hidden.bs.modal' : function() {
		qlog.info('Hiding the modal here ................................', filename);
		Session.set('QollIdToEdit', undefined);
		Session.set('QollRawIdToEdit', undefined);
	},
	'click .store' : function(event) {
		var content = 'undefined';
		var markdown = 'undefined';

		var tags = jQuery("input.tags").val();

		if (tags == undefined || tags === '') {
			QollError.message(QollConstants.MSG_TYPE.ERROR, 'Tags is required. Start typing the tags to autofill and select to continue.');
			return;
		}

		var tagArr = [];
		$.each(tags.split(/;|,|\s/), function(ix, tag) {
			tag = $.trim(tag);
			if (tag.length > 0) {
				tagArr.push(tag);
			}
		});
		
		if (QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.HTML)) {
			content = $('textarea#editor').val();

			//This method is added here only for display in log purpose. Remove it at some point of time.
			//No need to call a server side function to get value and then send it to the server.
			//Convert the value on the server
			
			Meteor.call("processStoreHtmlQoll", content, undefined, tagArr, 
				QollConstants.QOLL_ACTION_STORE, QollConstants.QOLL.VISIBILITY.PUB, 
				undefined, function(error, msg) {
				if (error) {
					qlog.error('Error occured while converting - ' + content + '/n to markdown - ' + error, filename);
	          		QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: ' + error + '/' + msg);
				} else {
					qlog.info('Recieved message - ' + msg, filename);
	          		QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: ' + msg);
	          		$('#qollModalEditor-topdiv').modal('hide');
	          		$( 'textarea#editor' ).val('');
	          		$('#tags').val('');
				}
			});

		} else if (QollEditorUtil.checkEditorMode(QollConstants.EDITOR_MODE.ADV)) {
			//If the default choice is markdown editor, get the text from markdown editor and process it accordingly
			var edtr = ace.edit("aceEditor");
			var content = edtr.getValue();

			//qlog.info('This is markdown editor content - ' + content, filename);
			//return;

			Meteor.call("addQollMaster", content, undefined, undefined, 
				QollConstants.QOLL_ACTION_STORE, QollConstants.QOLL.VISIBILITY.PUB, undefined, function(error, msg) {
				if (error) {
					qlog.error('Error occured while converting - ' + content + '/n to markdown - ' + error, filename);
		          	QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: ' + error + '/' + msg);
				} else {
					QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: ' + msg);
					$('#qollModalEditor-topdiv').modal('hide');
					edtr.setValue('', 1);
					$('#tags').val('');
				}
			});
		}

		qlog.info('Storing the qoll now - ' + content, filename);
	},
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

