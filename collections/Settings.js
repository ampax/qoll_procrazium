Settings = new Meteor.Collection('Settings');

Settings.allow({
  insert: function(userId, doc) {
  	return doc && (UserUtil.isAdminById(userId) || Meteor.userId);
  },
  update: function(userId, doc) {
  	return doc && (UserUtil.isAdminById(userId) || Meteor.userId) && userId == doc.userId;
  },
  remove: function(userId, doc) {
  	return doc && (UserUtil.isAdminById(userId) || Meteor.userId) && userId == doc.userId;
  }
});