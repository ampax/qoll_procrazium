var filename="client/views/editor/recipient.js";

Template.recipient.events({
  'click .store' : function(event){
    var content = 'undefined';
    var editor_choice = $('input[name=editorPref]:checked').val();
    if(editor_choice === QollConstants.EDITOR_MODE.HTML) {
      content = $( 'textarea#editor' ).val();
    }
    qlog.info('Storing the qoll now - ' + content, filename);
  },
  'click .send' : function(event){
    var content = 'undefined';
    var editor_choice = $('input[name=editorPref]:checked').val();
    if(editor_choice === QollConstants.EDITOR_MODE.HTML) {
      content = $( 'textarea#editor' ).val();
    }
    qlog.info('Sending the qoll now - ' + content, filename);
  },
});

Template.recipient.rendered = function() {
	qlog.info("Initializing autocomplete ... ", filename);
	Meteor.subscribe('RECIPIENTS_PUBLISHER');
	QollAutoComplete.init("input#recipient_search");
	QollAutoComplete.enableLogging = true;
};
Template.recipient.events({
  'keyup .recipient': function () {

    QollAutoComplete.autocomplete({
      element: 'input#recipient_search',       // DOM identifier for the element
      collection: Recipients,              // MeteorJS collection object (published object)
      field: 'groupName',                    // Document field name to search for
      limit: 0,                         // Max number of elements to show
      sort: { groupName: 1 },
      mode: 'multi',
      delimiter: ';'
    });              // Sort object to filter results with
      //filter: { 'gender': 'female' }}); // Additional filtering
  }, 
  'keyup .tags': function(){
    //TODO: Add google like tag class to the tags here
  },
  'click .qollQbankToggle': function(){
  	if (Session.get('disable_sendtoQbank')) return;
  	if( $('.qollQbankToggle').html().indexOf('Qoll To:')>-1 ){
  		$('.qollQbankToggle').html($('.qollQbankToggle').html().replace('Qoll To:','Qbank:  '));
  		$('.recipient').val('qbank@qoll.io');
  		$(".recipient").prop('disabled', true);
  		$('.toolbar-sendqoll').hide();
  	}else{
  		$("input").prop('disabled', false);
  		$('.qollQbankToggle').html($('.qollQbankToggle').html().replace('Qbank:  ','Qoll To:'));
  		$('.recipient').val('');
  		$('.toolbar-sendqoll').show();
  	}
  }
});