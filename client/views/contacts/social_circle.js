var filename="client/views/contacts/social_circle.js";

AllFriends = new Meteor.Collection("allFriends");

Template.contacts_container.helpers({
	contacts : function(event) {
		var allFriends = AllFriends.find({});
		qlog.info('Getting the dummy data - ' + allFriends.length, filename);
		var dummy = new Array();
		dummy.push({'lname' : 'Kaushik', 'fname' : 'Anoop', 'organization' : 'BlackRock'});
		dummy.push({'lname' : 'Sharma', 'fname' : 'Priyanka', 'organization' : 'MSSB'});
		dummy.push({'lname' : 'Kaushik', 'fname' : 'Amit', 'organization' : 'Barclays'});
		dummy.push({'lname' : 'Agarwal', 'fname' : 'Aparna', 'organization' : 'Chemistry'});
		dummy.push({'lname' : 'Gandhi', 'fname' : 'Rahul', 'organization' : 'Bewkoof'});
		return dummy;
	}
});