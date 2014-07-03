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
		//qlog.info('Updating the group - ' + g.group_name, filename);
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
	subscribeToGroup : function(group_name, author_email) {
		//var handle_usr = Meteor.users.findOne({ $or: [{'profile.email' : author_email}, {'user.emails.address' : author_email}] });
		/** Fix adding the group of legacy users **/
		var handle_usr = Meteor.users.findOne({'profile.email' : author_email});
		if(!handle_usr || !handle_usr._id) {
			return {err_msg : 'There are issues with - '+group_name+'\'s author - '+author_email+'. Contact the group-owner to fix it please.'};
		}

		var author_id = handle_usr._id;
		var my_id = Meteor.userId();
		var handle_me = Meteor.users.findOne(my_id);
		var groups_me = handle_me.groups;

		var just_groups = [];

		if(HashUtil.checkArray(groups_me)) {
			groups_me.map(function(g){
				just_groups.push(g.groupName);
			});
		} else {
			groups_me = new Array();
		}


		var new_group = {"groupOwner" : author_id, "groupName" : group_name};
		qlog.info("-------------------->" + just_groups + '' + new_group.groupName);
		if(!_.contains(just_groups, group_name)) {
			//Update the user and the groups table now
			var handle_gp = QollGroups.findOne({'submittedBy': author_id, 'groupName' : group_name});
			//QollGroups.find({'submittedBy': author_id, 'groupName' : group_name});
			//qlog.info('Printing the group ---------->' + JSON.stringify(handle_gp) + '/' + author_id + '/' + handle_me.profile.email, filename);
			var userEmails = handle_gp.userEmails;
			if(!_.contains(userEmails, handle_me.profile.email)) {
			qlog.info('Pusing to the usermeials - ' + userEmails + '/' + handle_me.profile.email);
			userEmails.push(handle_me.profile.email);
			QollGroups.update({_id : handle_gp._id}, {$set: {userEmails : userEmails}});
			} else {
				qlog.info('Not Pusing to the usermeials - ' + userEmails + '/' + handle_me.profile.email);
			}

			groups_me.push(new_group);
			Meteor.users.update({_id : my_id}, {$set: {groups : groups_me}});
		}
		return {scs_msg : 'Successfully Subscribed to - ' + group_name + ", " + author_email};
	},
});
