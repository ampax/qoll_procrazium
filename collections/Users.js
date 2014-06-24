QollRegister = new Meteor.Collection("QOLL_REGISTER");
QollGroups = new Meteor.Collection("QOLL_GROUPS");
Qoll = new Meteor.Collection("QOLL");


AllQolls = new Meteor.Collection("all-qolls");
QollGps = new Meteor.Collection("qoll-groups");
GroupStats = new Meteor.Collection("group-stats");


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