Meteor.users.allow({
  update: function(userId, doc){
  	return UserUtil.isAdminById(userId) || userId == doc._id;
  },
  remove: function(userId, doc){
  	return UserUtil.isAdminById(userId) || userId == doc._id;
  }
});