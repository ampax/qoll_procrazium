Recipients = new Meteor.Collection("recipients");
UserPrefs = new Meteor.Collection('UserPrefs');

QollGroups = new Meteor.Collection("QOLL_GROUPS");

QollFriends = new Meteor.Collection("QOLL_FRIENDS");

/** Used for one time server initialization **/
ServerInit = new Meteor.Collection('SERVER_INIT');

QollGps = new Meteor.Collection("qoll-groups");
GroupStats = new Meteor.Collection("group-stats");
UserSubscGroups = new Meteor.Collection("user-subscription-groups");
UserGroups = new Meteor.Collection("user-groups");
MyGroups = new Meteor.Collection("my-groups");
GroupForId = new Meteor.Collection("group-for-id");
AllQollUsers = new Meteor.Collection("all-qoll-users");
MyQollConnects = new Meteor.Collection("my-qoll-connects");
MyQollConnectsOpenReqs = new Meteor.Collection("my-qoll-connects-open-reqs");
MyQollConnectsOpenRecReqs = new Meteor.Collection("my-qoll-connects-open-rec-reqs");
MembersForGroupId = new Meteor.Collection("members-for-group-id");



Meteor.users.allow({
  update: function(userId, doc){
  	return UserUtil.isAdminById(userId) || userId == doc._id;
  },
  remove: function(userId, doc){
  	return UserUtil.isAdminById(userId) || userId == doc._id;
  }
});



QollGroups.allow({
  insert: function(userId, doc) {
  	return doc && Meteor.userId;
  },
  update: function(userId, doc) {
  	return doc && Meteor.userId;
  },
  remove: function(userId, doc) {
  	return doc && Meteor.userId;
  }
});