var filename="client/views/questionair/qbank_opt.js";

Template.qbank_opts.rendered = function() {
	qlog.info("Initializing autocomplete ... ", filename);
	
};
Template.qbank_opts.events({
  'keyup #recipient_search': function () {

    QollAutoComplete.init("input#recipient_search");
    QollAutoComplete.enableLogging = true;

    QollAutoComplete.autocomplete({
      element: 'input#recipient_search',       // DOM identifier for the element
      collection: Recipients,              // MeteorJS collection object (published object)
      field: 'name',                    // Document field name to search for
      limit: 0,                         // Max number of elements to show
      sort: { name: 1 },
      mode: 'multi',
      delimiter: ';'
    });              // Sort object to filter results with
      //filter: { 'gender': 'female' }}); // Additional filtering
  }, 
  'keyup #add-tags': function(){
    //TODO: Add google like tag class to the tags here
    qlog.info('Will add some tags here ...', filename);
    //Tags
  },
  'keyup #search-tags': function(){
    //TODO: Add google like tag class to the tags here
    qlog.info('Will search some tags here ...', filename);
    QollAutoComplete.init("input#search-tags");
    QollAutoComplete.enableLogging = true;

    QollAutoComplete.autocomplete({
      element: 'input#search-tags',       // DOM identifier for the element
      collection: Tags,              // MeteorJS collection object (published object)
      field: 'tag',                    // Document field name to search for
      limit: 0,                         // Max number of elements to show
      sort: { tag: 1 },
      mode: 'multi',
      delimiter: ';'
    }); 
  },
  'click .qollQbankToggle': function(){
  	if (Session.get('disable_sendtoQbank')) return;
  	if( $('.qollQbankToggle').html().indexOf('Qoll To:')>-1 ){
  		$('.qollQbankToggle').html($('.qollQbankToggle').html().replace('Qoll To:','Qbank:  '));
  		$('.recipient').val('qbank@qoll.io');
  		$(".recipient").prop('disabled', true);
  	}else{
  		$("input").prop('disabled', false);
  		$('.qollQbankToggle').html($('.qollQbankToggle').html().replace('Qbank:  ','Qoll To:'));
  		$('.recipient').val('');
  	}
  }
});