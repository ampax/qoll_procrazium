var filename='collections/SocialDb.js';

SocialFriends = new Meteor.Collection("SOCIAL_FRIENDS");
SocialConnect = new Meteor.Collection("SOCIAL_CONNECT");

SocialFriends.allow({
  fetch: ['owner']
});

SocialConnect.allow({
  fetch: ['owner']
});