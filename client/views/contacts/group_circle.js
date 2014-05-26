var filename="client/views/contacts/group_circle.js";

Template.groups_container.helpers({
	contact_groups : function(event){
		var dummy = new Array();
		dummy.push({'status':'Active', 'type' : 'Restricted', 'name' : 'Upen MH203', 'organization' : 'UPEN', 'mem_count': 26});
		dummy.push({'status':'Active', 'type' : 'Restricted', 'name' : 'BLK Employee Survey', 'organization' : 'BlackRock', 'mem_count': 12768});
		dummy.push({'status':'Active', 'type' : 'Public', 'name' : 'India Election 2014', 'organization' : '', 'mem_count': 12500000000});
		dummy.push({'status':'Active', 'type' : 'Restricted', 'name' : 'My Facebook Circle', 'organization' : 'Self', 'mem_count': 346});
		return dummy;
	},
});