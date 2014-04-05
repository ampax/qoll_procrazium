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
  	//qlog.info('Printing the inputted value: ' + jQuery("input#recipient_search" ).val(), filename);
  	//qlog.info("Printing all the recips: " + JSON.stringify(Recipients.find({})), filename);

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
});