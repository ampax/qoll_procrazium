QollRegister = new Meteor.Collection("QOLL_REGISTER");
QollGroups = new Meteor.Collection("QOLL_GROUPS");
Qoll = new Meteor.Collection("QOLL");

/** Used for one time server initialization **/
ServerInit = new Meteor.Collection('SERVER_INIT');

AllQolls = new Meteor.Collection("all-qolls");
QollGps = new Meteor.Collection("qoll-groups");
GroupStats = new Meteor.Collection("group-stats");
Recipients = new Meteor.Collection("recipients");
UserSubscGroups = new Meteor.Collection("user-subscription-groups");



Meteor.users.allow({
  update: function(userId, doc){
  	return UserUtil.isAdminById(userId) || userId == doc._id;
  },
  remove: function(userId, doc){
  	return UserUtil.isAdminById(userId) || userId == doc._id;
  }
});


QollRegister.allow({
	update: function(userId, doc){return true;},
	remove: function(userId, doc){return true;},
	insert: function(userId, doc){return true;}
});

QollGroups.allow({
	update: function(userId, doc){return true;},
	remove: function(userId, doc){return true;},
	insert: function(userId, doc){return true;}
});

Qoll.allow({
	update: function(userId, doc){return true;},
	remove: function(userId, doc){return true;},
	insert: function(userId, doc){return true;}
});