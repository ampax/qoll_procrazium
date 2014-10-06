Recipients = new Meteor.Collection("recipients");
UserPrefs = new Meteor.Collection('UserPrefs');

QollGroups = new Meteor.Collection("QOLL_GROUPS");

/** Used for one time server initialization **/
ServerInit = new Meteor.Collection('SERVER_INIT');

QollGps = new Meteor.Collection("qoll-groups");
GroupStats = new Meteor.Collection("group-stats");
UserSubscGroups = new Meteor.Collection("user-subscription-groups");
UserGroups = new Meteor.Collection("user-groups");
MyGroups = new Meteor.Collection("my_group");



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
  	return doc && Meteor.userId && userId == doc.userId;
  },
  remove: function(userId, doc) {
  	return doc && Meteor.userId && userId == doc.userId;
  }
});