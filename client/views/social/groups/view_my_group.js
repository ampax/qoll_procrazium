var filename='client/views/social/groups/view_my_group.js';

Template.view_my_group.rendered = function(){
	//set the background of the selected box.
	$('li#groups').css('background-color', 'firebrick');
};

Template.view_my_subsc_group.rendered = function(){
	//set the background of the selected box.
	$('li#groups').css('background-color', 'firebrick');
};

Template.view_my_group.helpers({
	group : function() {
		return GroupForId.findOne() ;
	},
});

Template.view_my_group.events({
	'keyup input#add_usrs_to_grp': function (e) {
		e.preventDefault();
		var usr_search_val = $('#add_usrs_to_grp').val();
		qlog.info('Printing group_search_val --->' + usr_search_val, filename);
		//Meteor.subscribe('PUBLISH_GROUPS_OF_USER', group_search_val);

	    QollAutoComplete.autocomplete({
		      element: 'input#add_usrs_to_grp',       // DOM identifier for the element
		      collection: MyQollConnects,              // MeteorJS collection object (published object)
		      field: 'name',                    // Document field name to search for
		      value: 'name',
		      limit: 0,                         // Max number of elements to show
		      sort: { name: 1 },
		      //mode: 'mono',
		      delimiter: ';'
		    }, 'name', 
		    function(data){
		    	return data.name + '(' + data.email + ')'; 
		    	//TODO
		    });              // Sort object to filter results with
		      //filter: { 'gender': 'female' }}); // Additional filtering
	},
	'click .add' : function(e) {
		e.preventDefault();
		console.log(this);
		var usr_search_val = $('#add_usrs_to_grp').val();

		var usr_search_val_arr = usr_search_val.split("(");
		var	usr_search_val_arr_1 = usr_search_val_arr[1].split(")");
		var usr_name = usr_search_val_arr[0];
		var usr_email = usr_search_val_arr_1[0];

		qlog.info('Adding user to the group - ' + this.groupId + '/' + usr_search_val + '/' + usr_email, filename);

		Meteor.call('addUserToGroup', this.groupId, usr_email, function(err, message) {
			if(err) {
				qlog.info('Error happened while adding user to the group - ' + message, filename);
			} else {
				qlog.info('Success added user to the group (message) - ' + message, filename);
				$('#add_usrs_to_grp').val('');
			}
		});
	},
	'click .remove' : function(e) {
		e.preventDefault();
		console.log(this);
		var usr_id = this.contact._id;
		var usr_email = this.contact.email;
		var group_id = Template.parentData().groupId;
		qlog.info('Remove is clicked. Removing this contact now - ' + usr_id + '/' + usr_email + '/' + group_id, filename);
		
		Meteor.call('removeUserFromGroup', group_id, usr_email, function(err, message) {
			if(err) {
				qlog.info('Error happened while removing user to the group - ' + message, filename);
			} else {
				qlog.info('Success removed user from the group (message) - ' + message.scs_msg, filename);
			}
		});
	},
	
});


