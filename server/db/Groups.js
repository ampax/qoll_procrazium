var filename="server/db/Groups.js";

//User Preferences table
GroupsTbl = new Meteor.Collection("GROUPS");

//Global server object to access the Group methods
Groups = {};

Groups.fetch = function(userId) {
	return GroupsTbl.find({created_by : userId, status: QollConstants.STATUS.ACTIVE})
};

//g is the hash carrying all to create/update the group
Groups.insertUpdate = function(g, userId){

	var group = GroupsTbl.find({group_name : g.group_name, userId : userId, status: QollConstants.STATUS.ACTIVE}).fetch();
	qlog.info('Found the group - ' + JSON.stringify(group), filename);

	//
	if(group.length > 0) {
		qlog.info('Updating the group - ' + g.group_name, filename);
		/**group.group_name = g.group_name;
		group.group_desc = g.group_desc;
		group.pub_or_pvt = g.pub_or_pvt;
		group.clsd_or_open = g.clsd_or_open;
		group.created_by = g.created_by;
		grop.sm_or_lg = g.size_flag;
		group.invt_only = g.invt_only;*
		group.type = g.type;**/
		g.updated_on = new Date();
		GroupsTbl.update({_id: group._id}, {$set : g});
	} else {
		g.created_by = userId;
		g.created_on = new Date();
		var grp_id = GroupsTbl.insert(g);
	    qlog.info('Created new group ' + grp_id, filename);

	    //Update user authored groups
	    var user = Meteor.users.find({_id : userId});

	    //Update the userids with email-ids now
	    userEmails.map(function(userEmail) {
	    	//find and set the group for users
	    });
	}
};

Groups.isTaken = function(group_name){
	var group = GroupsTbl.find({group_name : g.group_name, status: QollConstants.STATUS.ACTIVE}).fetch();
	return group != undefined;
};

Meteor.methods({
	insertUpdateGroup : function(g, userId){
		//insert using the db method
		Groups.insertUpdate(g, userId);
	},
	fetchGroups : function(userId){
		return Groups.fetch(userId);
	},
});
