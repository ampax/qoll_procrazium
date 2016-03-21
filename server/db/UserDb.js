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
    isAdmin: function() {
        if(!Meteor.userId()) return false;

        var usr = Meteor.users.findOne({_id : Meteor.userId()});
        var email = usr.profile.email;

        return _.indexOf(['procrazium@gmail.com', 'cozenlabs@gmail.com'], email) != -1;
    },

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
    updateCreateUserGroup : function(groupName, groupDesc, userEmails, domainSpec, groupAccess, inviteOnly, groupSize, closedOrOpen) {
        qlog.info('================ Printing group info ===================', filename);
        qlog.info('groupName: ' +groupName+', groupDesc: '+ groupDesc+', userEmails: '+ userEmails+', domainSpec: '+ domainSpec+
            ', groupAccess: '+ groupAccess+', inviteOnly: '+ inviteOnly+', groupSize: '+ groupSize+', closedOrOpen: '+ closedOrOpen, filename);
        
        var userIds = {};
        var groupActualSize = 0;

        userEmails.map(function(userEmail){
            var user=Meteor.users.findOne({ "profile.email" : userEmail });
            if(!user) {
                user=Meteor.users.findOne({ "emails.address" : userEmail });
            }

            if(user) { // user is found in Qoll, populate the user-id in the group
                userIds[user._id] = 'approved';
            } else { // user does not exist in our system, we will send an email instead
                userIds[userEmail] = 'approved';
            }

            groupActualSize = groupActualSize +1;
        });

        var gpId = QollGroups.insert({
            'groupName' : groupName,
            'groupDesc' : groupDesc,
            'userEmails' : userEmails,
            'userIds'   : userIds,
            'domainSpec' : domainSpec,
            'groupAccess'  : groupAccess,
            'pubOrPvt'  : groupAccess,
            'inviteOnly' : inviteOnly,
            'groupSize' : groupSize,
            'groupActualSize' : groupActualSize,
            'closedOrOpen' : closedOrOpen,
            
            'createdOn' : new Date(),
            'createdBy' : Meteor.userId(),
            'submittedOn' : new Date(),
            'submittedBy' : Meteor.userId(),
            'role' : QollConstants.GROUPS.ROLE.OWNER,
            'status'    : QollConstants.STATUS.ACTIVE
        });

        userEmails.map(function(userEmail) {
            updateUserGroupWithEmail(gpId, groupName, userEmail);
        });

        updateUserGroupsCreated(gpId, groupName);

        return gpId;
    },
    removeUserGroup : function(groupId) {
        qlog.info('Removing group with id - ' + groupId, filename);
        QollGroups.update({ '_id' : groupId }, { $set : { updatedBy : Meteor.userId(), updatedOn : new Date(), status : QollConstants.STATUS.ARCHIVE } });
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
            'submittedOn' : new Date(),
            'submittedBy' : Meteor.userId(),
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
	},
    connectWithQollUser : function(friend_id) {
        //QollFriends
        if(this.userId) {
            var friend_handle = QollFriends.findOne({user_id : this.userId, friend_id : friend_id});
            if(friend_handle) {
                //Friend already exists. Don't do anything.
            } else {
                //Let us initiate a request to the user for qoll-friendship
                QollFriends.insert({
                    user_id         : this.userId,
                    friend_id       : friend_id,
                    status          : QollConstants.STATUS.PENDING,
                    initiated_on    : new Date(),
                    //confirmed_on  : when_confirmed,
                });
            }
        }
    },
    deleteQollConnection : function(friend_id) {
        //QollFriends
        if(this.userId) {
            QollFriends.remove({user_id : this.userId, friend_id : friend_id}, function(err){
                if(!err) {
                    return 'Successfully removed the connection.';
                }
            });
        }
    },
    confirmRecQollConnectReq : function(friend_id) {
        //QollFriends
        if(this.userId) {
            QollFriends.update({ friend_id: this.userId, user_id : friend_id}, {$set: {status : QollConstants.STATUS.CONFIRMED, confirmed_on : new Date()}}, function(error){
                if(error){
                    qlog.error('Error happened while connecting with user: ' + friend_id + ', ERROR: ' + error, filename);
                } else {
                    qlog.info('Connected with friend ' + friend_id, filename);
                    var friend_handle = QollFriends.findOne({user_id : this.userId, friend_id : friend_id});
                    if(friend_handle) {
                        //Friend already exists. Don't do anything.
                    } else {
                        //Let us initiate a request to the user for qoll-friendship
                        qlog.info('===========Creating cross connect record=============', filename);
                        QollFriends.insert({
                            user_id         : this.userId,
                            friend_id       : friend_id,
                            status          : QollConstants.STATUS.CONFIRMED,
                            initiated_on    : new Date(),
                            confirmed_on    : new Date(),
                            //confirmed_on  : when_confirmed,
                        });
                    }
                }
            });
        }
    },
    declineRecQollConnectReq: function(friend_id) {
        //QollFriends
        if(this.userId) {
            QollFriends.update({friend_id: this.userId, user_id : friend_id}, {$set: {status : QollConstants.STATUS.DECLINED}}, function(error){
                if(error){
                    qlog.error('Error happened while connecting with user: ' + friend_id + ', ERROR: ' + error, filename);
                } else {
                    qlog.info('Connected with friend ' + friend_id, filename);
                }
            });
        }
    },
    deleteSentQollConnectReq: function(friend_id) {
        //QollFriends
        if(this.userId) {
            QollFriends.remove({user_id : this.userId, friend_id : friend_id}, function(error){
                if(error){
                    qlog.error('Error happened while connecting with user: ' + friend_id + ', ERROR: ' + error, filename);
                } else {
                    qlog.info('Connected with friend ' + friend_id, filename);
                }
            });
        }
    },
    inviteSocialContactToJoinQoll: function(friend_id) {
        //QollFriends
        if(this.userId) {
            //Sent an email to connect with Qoll to a non-Qoll user
            QollMailer.sendContactUsEmail('webmaster@qoll.io', 'kaushik.anoop@gmail.com', 'Join me on Qoll', 'This is join me on qoll message.');
        }
    },

});


updateUserGroupWithEmail = function(groupId, groupName, userEmail){
    var user=Meteor.users.findOne({ "profile.email" : userEmail });
    if(!user) {
        user=Meteor.users.findOne({ "emails.address" : userEmail });
    }

    if(user) {
        qlog.info('Fetched user with email - ' + userEmail, filename);

        if(!user.groups) {
            user.groups = {};
        }
        qlog.info('Found user: ' + JSON.stringify(user) + ', crt: ' + user.createdAt, filename);

        var groupInfo = {};
        groupInfo['groupOwner'] = Meteor.userId();
        groupInfo['groupName'] = groupName;
        groupInfo['accessApproved'] = "approved";
        groupInfo['groupId'] = groupId;

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
}


updateUserGroupsCreated = function(groupId, groupName) {
    var currUser = Meteor.users.findOne({_id : Meteor.userId()});
    if(!currUser.groupsCreated) {
        currUser.groupsCreated = [];
    }

    var groupInfo = {};
    groupInfo['groupId'] = groupId;
    groupInfo['groupName'] = groupName;

    Meteor.users.update({ _id : Meteor.userId() }, {$push: {groupsCreated : groupInfo}}, function(error){
        if(error){
            qlog.error('Error happened while pushing owner groups for user: ' + currUser._id + ', group: ' + groupName + ', ERROR: ' + error, filename);
        } else {
            qlog.info('Done pushing owner group: ' + groupName + '/' + groupId , filename);
        }
    });
}
