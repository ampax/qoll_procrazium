var filename="server/db/Groups.js";

//User Preferences table
GroupsTbl = new Meteor.Collection("GROUPS");

//Global server object to access the Group methods
Groups = {};

Groups.fetch = function(userId) {
	return GroupsTbl.find({created_by : userId, status: QollConstants.STATUS.ACTIVE})
};

Groups.fetchForQuery = function(qry) {
	return QollGroups.find(qry);
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

		var handle_gp = QollGroups.findOne({'submittedBy': author_id, 'groupName' : group_name});

		var is_private = handle_gp.groupAccess === 'private';
		var access_approved = is_private? 'pending' : 'approved';

		var new_group = {"groupOwner" : author_id, "groupName" : group_name, 'accessApproved' : access_approved};

		if(!handle_me.groups) handle_me.groups = [];
		var groups_me = handle_me.groups;

		var just_groups = [];
		
		if(HashUtil.checkArray(groups_me)) {
			groups_me.map(function(g){
				just_groups.push(g.groupName);
			});
		} else {
			groups_me = new Array();
		}


		if(!_.contains(just_groups, group_name)) {
			//Update the user and the groups table now
			qlog.warn('***'+author_id + '/' + group_name+'***', filename);
			new_group.groupId = handle_gp._id;
			//QollGroups.find({'submittedBy': author_id, 'groupName' : group_name});
			//qlog.info('Printing the group ---------->' + JSON.stringify(handle_gp) + '/' + author_id + '/' + handle_me.profile.email, filename);
			var userEmails = handle_gp.userEmails;
			qlog.debug(userEmails);
			if(!_.contains(userEmails, handle_me.profile.email)) {
				qlog.info('Pushing to the usermeials - ' + userEmails + '/' + handle_me.profile.email);
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
	unSubscribeFromGroup : function(group_id) {
		// find the group to unsubscribe from
		var handle_gp = QollGroups.findOne({'_id': group_id});
		//var handle_usr = Meteor.users.findOne({ $or: [{'profile.email' : author_email}, {'user.emails.address' : author_email}] });
		/** Fix adding the group of legacy users **/
		var handle_usr = Meteor.users.findOne(handle_gp.submittedBy);
		if(!handle_usr || !handle_usr._id) {
			return {err_msg : 'There are issues with - '+group_name+'\'s author - '+author_email+'. Contact the group-owner to fix it please.'};
		}

		var group_name = handle_gp.groupName;
		
		var author_id = handle_usr._id;
		var my_id = Meteor.userId();
		var handle_me = Meteor.users.findOne(my_id);

		var new_group = {"groupId": handle_gp._id, "groupOwner" : author_id, "groupName" : group_name};
		qlog.info('This will be unsubscribed - ' + JSON.stringify(new_group), filename);

		var groups_me = handle_me.groups;

		var just_groups_modified = [];

		var contains = false;

		groups_me.forEach(function(gm){
				qlog.info(JSON.stringify(gm), filename);
				if(gm.groupId === new_group.groupId && gm.groupOwner === new_group.groupOwner && gm.groupName === new_group.groupName) {
					contains = true;
				}
			});

		qlog.info('Groups me - ' + JSON.stringify(groups_me), filename);

		qlog.info('Printing whether or not contains this group in my list ... ' + contains, filename);

		if(contains) {
			groups_me.forEach(function(gm){
				if(!(gm.groupId === new_group.groupId && gm.groupOwner === new_group.groupOwner && gm.groupName === new_group.groupName)) {
					just_groups_modified.push(gm);
				}
			});

			qlog.info('Just modified groups - ' + JSON.stringify(just_groups_modified), filename);

			//Update the user and the groups table now
			var userEmails = handle_gp.userEmails;
			var userEmailsModified = [];
			
			userEmails.forEach(function(ue){
				if(ue != handle_me.profile.email) {
					userEmailsModified.push(ue);
				}
			});

			QollGroups.update({_id : handle_gp._id}, {$set: {userEmails : userEmailsModified}});

			Meteor.users.update({_id : my_id}, {$set: {groups : just_groups_modified}});
		}
		return {scs_msg : 'Successfully UnSubscribed to - ' + group_name + ", " + handle_usr.profile.email};
	},
	unSubscribeUserFromGroup : function(group_id, user_id) {
		// find the group to unsubscribe from
		var handle_gp = QollGroups.findOne({'_id': group_id});
		//var handle_usr = Meteor.users.findOne({ $or: [{'profile.email' : author_email}, {'user.emails.address' : author_email}] });
		/** Fix adding the group of legacy users **/
		var handle_usr = Meteor.users.findOne(handle_gp.submittedBy);
		if(!handle_usr || !handle_usr._id) {
			return {err_msg : 'There are issues with - '+group_name+'\'s author - '+author_email+'. Contact the group-owner to fix it please.'};
		}

		var group_name = handle_gp.groupName;
		
		var author_id = handle_usr._id;
		var handle_me = Meteor.users.findOne(user_id);

		var new_group = {"groupId": handle_gp._id, "groupOwner" : author_id, "groupName" : group_name};
		qlog.info('This will be unsubscribed - ' + JSON.stringify(new_group), filename);

		var groups_me = handle_me.groups;

		var just_groups_modified = [];

		var contains = false;

		groups_me.forEach(function(gm){
				qlog.info(JSON.stringify(gm), filename);
				if(gm.groupId === new_group.groupId && gm.groupOwner === new_group.groupOwner && gm.groupName === new_group.groupName) {
					contains = true;
				}
			});

		qlog.info('Groups me - ' + JSON.stringify(groups_me), filename);

		qlog.info('Printing whether or not contains this group in my list ... ' + contains, filename);

		if(contains) {
			groups_me.forEach(function(gm){
				if(!(gm.groupId === new_group.groupId && gm.groupOwner === new_group.groupOwner && gm.groupName === new_group.groupName)) {
					just_groups_modified.push(gm);
				}
			});

			qlog.info('Just modified groups - ' + JSON.stringify(just_groups_modified), filename);

			//Update the user and the groups table now
			var userEmails = handle_gp.userEmails;
			var userEmailsModified = [];
			
			userEmails.forEach(function(ue){
				if(ue != handle_me.profile.email) {
					userEmailsModified.push(ue);
				}
			});

			QollGroups.update({_id : handle_gp._id}, {$set: {userEmails : userEmailsModified}});

			Meteor.users.update({_id : user_id}, {$set: {groups : just_groups_modified}});
		}
		return {scs_msg : 'Successfully UnSubscribed to - ' + group_name + ", " + handle_usr.profile.email};
	},
	addUserToGroup : function(group_id, user_email) {
		//var handle_usr = Meteor.users.findOne({ $or: [{'profile.email' : author_email}, {'user.emails.address' : author_email}] });
		/** Fix adding the group of legacy users **/
		var handle_usr = Meteor.users.findOne({'profile.email' : user_email});
		if(!handle_usr || !handle_usr._id) {
			return {err_msg : 'There are issues with - '+group_id+'\'s author - '+user_email+'. Contact the group-owner to fix it please.'};
		}

		var handle_gp = QollGroups.findOne({_id : group_id});

		var my_id = handle_usr._id;
		var author_id = handle_gp.submittedBy;
		var handle_usr = Meteor.users.findOne(my_id);
		var groups_usr = handle_usr.groups;

		var just_groups = [];

		if(HashUtil.checkArray(groups_usr)) {
			groups_usr.map(function(g){
				just_groups.push(g.groupName);
			});
		} else {
			groups_usr = new Array();
		}


		var new_group = {"groupOwner" : author_id, "groupName" : handle_gp.groupName, groupId : handle_gp._id};
		qlog.info("-------------------->" + just_groups + '' + new_group.groupName);
		if(!_.contains(just_groups, handle_gp.groupName)) {
			//Update the user and the groups table now
			var userEmails = handle_gp.userEmails;
			if(!_.contains(userEmails, handle_usr.profile.email)) {
			qlog.info('Pusing to the usermeials - ' + userEmails + '/' + handle_usr.profile.email);
			userEmails.push(handle_usr.profile.email);
			QollGroups.update({_id : handle_gp._id}, {$set: {userEmails : userEmails}});
			} else {
				qlog.info('Not Pusing to the usermeials - ' + userEmails + '/' + handle_usr.profile.email);
			}

			groups_usr.push(new_group);
			Meteor.users.update({_id : my_id}, {$set: {groups : groups_usr}});
		}
		return {scs_msg : 'Successfully Subscribed to - ' + handle_gp.groupName + ", " + author_id};
	},
	removeUserFromGroup : function(group_id, user_email) {
		//var handle_usr = Meteor.users.findOne({ $or: [{'profile.email' : author_email}, {'user.emails.address' : author_email}] });
		/** Fix adding the group of legacy users **/
		qlog.info('Called with parameters - ' + group_id + '/' + user_email, filename);
		var handle_usr = Meteor.users.findOne({'profile.email' : user_email});
		if(!handle_usr || !handle_usr._id) {
			return {err_msg : 'There are issues with - '+group_id+'\'s author - '+user_email+'. Contact the group-owner to fix it please.'};
		}

		var handle_gp = QollGroups.findOne({_id : group_id});

		var my_id = handle_usr._id;
		var author_id = handle_gp.submittedBy;
		var handle_usr = Meteor.users.findOne(my_id);
		var groups_usr = handle_usr.groups;

		qlog.info('groups -------------- ' + groups_usr + ', emails ---------- ' + handle_gp.userEmails, filename);

		var just_groups = [];

		var splice_ctr = -1;
		if(HashUtil.checkArray(groups_usr)) {
			groups_usr.map(function(g, idx){
				qlog.info('-------------------'+JSON.stringify( g) + '/'+idx, filename);
				if(g.group_id && group_id === g.groupId) {
					splice_ctr = idx;
					qlog.info('-------------------'+splice_ctr, filename);
					return false;
				} else if(handle_gp.groupName === g.groupName) {
					splice_ctr = idx;
					qlog.info('-------------------'+splice_ctr, filename);
					return false;
				}
			});
		}

		if(splice_ctr === -1) { 
			return {err_msg : 'User is not part of the group - ' + handle_gp.groupName};
		}

		groups_usr.splice(splice_ctr, 1);
		splice_ctr = -1;

		var userEmails = handle_gp.userEmails;
		if(_.contains(userEmails, handle_usr.profile.email)) {
			userEmails.map(function(email, idx){
				if(user_email === email) {
					splice_ctr = idx;
					return false;
				}
			});
		}

		userEmails.splice(splice_ctr, 1);
		qlog.info('groups --- ' + groups_usr + ', emails --- ' + userEmails, filename);
		/* Update the tables to remove the user from the group now */
		//Remove user-email from the group
		QollGroups.update({_id : handle_gp._id}, {$set: {userEmails : userEmails}});
		//Remove group from the user
		Meteor.users.update({_id : my_id}, {$set: {groups : groups_usr}});

		return {scs_msg : 'Successfully un-subscribed from - ' + handle_gp.groupName + ", user - " + handle_usr.profile.name};
	},
	removeGroup: function(groupId) {
		qlog.info('Removing group with id - ' + groupId, filename);
        QollGroups.update({ '_id' : groupId }, { $set : { updatedBy : Meteor.userId(), updatedOn : new Date(), status : QollConstants.STATUS.ARCHIVE } });
	},
	approveUserGroupSubscriptionReq: function(group_id, user_id) {
		// update users groups record and set the accessApproved status to approved
		var handle_usr = Meteor.users.findOne({_id : user_id});
		var groups = handle_usr.groups;
		var groups_modified = [];
		groups.forEach(function(g){
			if(g.groupId === group_id) {
				g.accessApproved = 'approved';
			}
			groups_modified.push(g);
		});

		Meteor.users.update({_id : user_id}, {$set: {groups : groups_modified}});
	}
});
