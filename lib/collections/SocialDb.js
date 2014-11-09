var filename='collections/SocialDb.js';

//Core social collections
SocialFriends = new Meteor.Collection("SOCIAL_FRIENDS");
SocialConnect = new Meteor.Collection("SOCIAL_CONNECT");


//Published social collections
//AllFriends = new Meteor.Collection("all-my-friends");
AllMyFriends = new Meteor.Collection("all-my-friends");

SocialConnect.allow({
  fetch: ['owner']
});


SocialFriends.allow({
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