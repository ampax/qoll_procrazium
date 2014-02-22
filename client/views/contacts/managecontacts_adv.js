var filename="client/views/editor/managecontacts_adv.js";

var Qollers = new Meteor.Collection("qollers");

Template.managecontacts_adv.rendered = function() {
	qlog.info("Initializing autocomplete ... ", filename);
	Meteor.subscribe('QOLLERS_PUBLISHER');
	AutoCompletion.init("input#friends_search");
	AutoCompletion.enableLogging = true;
};

Template.managecontacts_adv.events({
  'keyup .friends': function () {
  	qlog.info('Printing the inputted value: ' + jQuery("input#friends_search" ).val(), filename);
  	qlog.info("Printing all the recips: " + JSON.stringify(Qollers.find({})), filename);

    AutoCompletion.autocomplete({
      element: 'input#friends_search',       // DOM identifier for the element
      collection: Recipients,              // MeteorJS collection object (published object)
      field: 'name',                    // Document field name to search for
      limit: 0,                         // Max number of elements to show
      sort: { name: 1 }});              // Sort object to filter results with
      //filter: { 'gender': 'female' }}); // Additional filtering
  }, 
});