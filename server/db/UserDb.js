var filename = 'server/db/UserDb.js';

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
        userEmails.map(function(userEmail){
            //qlog.info('Updating the user for groups: *' + userEmail + '*, groupName: ' + groupName, filename);
            //Mongo Query: - db.users.find({'emails.address': {$regex:'abc',$options:'i'}});
            //var user = Users.findOne({'emails.address': {$regex:userEmail,$options:'i'}});
            updateUserGroupWithEmail(groupName, userEmail);
        });

        updateUserGroupsCreated(groupName);
    }
});


updateUserGroupWithEmail = function(groupName, userEmail){
    var user=Meteor.users.findOne({ "emails.address" : userEmail });
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
