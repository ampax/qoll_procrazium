var filename = 'server/db/UserDb.js';

/*
* QOLL_GROUPS {
   group_name,
   group_desc,
   pub_or_pvt,
   closed_or_open_ended,
   small_or_large,
   by_invite_only,
   created_by,
   created_on,
   modified_on,
   role,
   _id
* }
*/


/** START: New standard code **/
Usr = {};

Usr.all = function() {
    return Meteor.users.find({});
};

Usr.update = function(userId, hash_to_update){
    Meteor.users.update({_id: userId}, {$set : hash_to_update});
};

//Ensure a hash in the user-hash
Usr.ensure = function(userId, col) {
    var usr = Meteor.users.findOne({_id : userId});
    if(usr[col] == undefined) {
        usr[col] = {};
    }
};

//Ensure a hash in the user hash and insert the value in it
Usr.ensureUpdate = function(userId, col_name, col_val) {
    var usr = Meteor.users.findOne({_id : userId});
    if(usr[col] == undefined) {
        usr[col] = {};
    }
    usr[col][col_name] = col_val;
};
/** END: New standard code **/

Meteor.methods({
	currentUserName: function(){
        qlog.info("Getting avatar for: " + Meteor.userId(), filename);
        return Meteor.users.find({_id : Meteor.userId()}).profile.name;
    },

    currentUserEmail: function(){
        qlog.info("Getting user email for: " + Meteor.userId(), filename);
        return Meteor.users.find({_id : Meteor.userId()}).profile.email;
    },

    currentUserAvatar: function(){
        qlog.info("Getting avatar for: " + Meteor.userId(), filename);
        return Meteor.users.find({_id : Meteor.userId()}).profile.avatar_url;
    },
    
	updateUserGroup: function(groupName, userEmails) {
        var size = userEmails.length;
        var groupSize = QollConstants.GROUPS.SM;
        if(size > 1000 && size < 1000)
            groupSize = QollConstants.GROUPS.MD;
        else if (size >= 1000)
            groupSize = QollConstants.GROUPS.LG;

		var gpId = QollGroups.insert({
			'groupName' : groupName,
            'groupDesc' : groupName,
            'pubOrPvt'  : QollConstants.GROUPS.PVT,
            'closedOrOpen' : QollConstants.GROUPS.CLOSED,
            'groupSize' : groupSize,
            'inviteOnly' : QollConstants.GROUPS.INVITE,
			'userEmails' : userEmails,
			'createdOn' : new Date(),
			'createdBy' : Meteor.userId(),
            'role' : QollConstants.GROUPS.ROLE.OWNER
		});
		userEmails.map(function(userEmail) {
			//qlog.info('Updating the user for groups: *' + userEmail + '*, groupName: ' + groupName, filename);
			//Mongo Query: - db.users.find({'emails.address': {$regex:'abc',$options:'i'}});
			//var user = Users.findOne({'emails.address': {$regex:userEmail,$options:'i'}});
			updateUserGroupWithEmail(groupName, userEmail);
		});

		updateUserGroupsCreated(groupName);
	},
	userAddGroupMembership:function(groupName, ownerEmail){
		var owneruser=UserUtil.findByEmail(ownerEmail);
		
		if(owneruser){
			var grpfound=QollGroups.findOne({'submittedBy':owneruser._id,'groupName':groupName});
					
			if(grpfound){
				
				if( grpfound.userEmails=== undefined || grpfound.userEmails.indexOf(UserUtil.getEmail(Meteor.user()))<0){
							
					return QollGroups.update(
                    { _id: grpfound._id },
                    { $push: { userEmails: UserUtil.getEmail(Meteor.user()) } }
                 );
				}
			}
		}
		return false;
	}

});


updateUserGroupWithEmail = function(groupName, userEmail){
    var user=Meteor.users.findOne({ "profile.email" : userEmail });
    if(!user) {
        user=Meteor.users.findOne({ "emails.address" : userEmail });
    }

    if(user) qlog.info('Fetched user with email - ' + userEmail, filename);

    if(!user.groups) {
        user.groups = {};
    }
    qlog.info('Found user: ' + JSON.stringify(user) + ', crt: ' + user.createdAt, filename);

    var groupInfo = {};
    groupInfo['groupOwner'] = Meteor.userId();
    groupInfo['groupName'] = groupName;

    if(user._id) {
        Meteor.users.update({ "emails.address" : userEmail }, {$push: {groups : groupInfo}}, function(error){
            if(error){
                qlog.error('Error happened while pushing groups for user: ' + user._id + ', group: ' + groupName + ', ERROR: ' + error, filename);
            } else {
                qlog.info('Done pushing group: ' + groupName + ' for email: ' + userEmail, filename);
            }
        });
    } else {
        qlog.error('No user exists for email-id: ' + userEmail, filename);
    }
}


updateUserGroupsCreated = function(groupName) {
    var currUser = Meteor.users.findOne({_id : Meteor.userId()});
    if(!currUser.groupsCreated) {
        currUser.groupsCreated = [];
    }

    Meteor.users.update({ _id : Meteor.userId() }, {$push: {groupsCreated : groupName}}, function(error){
        if(error){
            qlog.error('Error happened while pushing owner groups for user: ' + currUser._id + ', group: ' + groupName + ', ERROR: ' + error, filename);
        } else {
            qlog.info('Done pushing owner group: ' + groupName , filename);
        }
    });
}
