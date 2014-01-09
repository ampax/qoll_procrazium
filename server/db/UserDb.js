var filename = 'server/db/UserDb.js';

Users = new Meteor.Collection("USERS");

Meteor.methods({
	currentUserName: function(){
        qlog.info("Getting avatar for: " + Meteor.userId(), filename);
        return Users.find({_id : Meteor.userId()}).profile.name;
    },

    currentUserEmail: function(){
        qlog.info("Getting user email for: " + Meteor.userId(), filename);
        return Users.find({_id : Meteor.userId()}).profile.email;
    },

    currentUserAvatar: function(){
        qlog.info("Getting avatar for: " + Meteor.userId(), filename);
        return Users.find({_id : Meteor.userId()}).profile.avatar_url;
    },
});