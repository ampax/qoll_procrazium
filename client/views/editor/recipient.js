var filename="client/views/editor/recipient.js";

var Recipients = new Meteor.Collection("recipients");

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
  'click .qollQbankToggle': function(){
  	if( $('.qollQbankToggle').html().indexOf('Qoll To:')>-1){
  		$('.qollQbankToggle').html($('.qollQbankToggle').html().replace('Qoll To:','To Qbank...'));
  		$('.recipient').val('qbank@qoll.io');
  		$(".recipient").prop('disabled', true);
  	}else{
  		$("input").prop('disabled', false);
  		$('.qollQbankToggle').html($('.qollQbankToggle').html().replace('To Qbank...','Qoll To:'));
  		$('.recipient').val('');
  	}
  }
});