var filename='lib/UserUtil.js';

/**********************************************/

    /*Global User-Util Functions for Qoll*/

/**********************************************/

UserUtil = {};

UserUtil.isAdminById=function(userId){
  var user = Meteor.users.findOne(userId);
  return !!(user && UserUtil.isAdmin(user));
}
UserUtil.isAdmin=function(user){
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return !!user && !!user.isAdmin;
}
UserUtil.isInvited=function(user){
  if(!user || typeof user === 'undefined')
    return false;
  return UserUtil.isAdmin(user) || !!user.isInvited;
}
UserUtil.adminUsers = function(){
  return Meteor.users.find({isAdmin : true}).fetch();
}
UserUtil.getUserName = function(user){
  return user.username || UserUtil.getProperty(user, 'services.twitter.screenName');
}
UserUtil.getDisplayName = function(user){
  return (user.profile && user.profile.name) ? user.profile.name : user.username;
}
UserUtil.getDisplayNameById = function(userId){
  return UserUtil.getDisplayName(Meteor.users.findOne(userId));
}
UserUtil.getProfileUrl = function(user) {
  return Meteor.absoluteUrl()+'users/' + URLUtil.slugify(getUserName(user));
}
UserUtil.getProfileUrlById = function(id){
  return Meteor.absoluteUrl()+'users/'+ id;
}
UserUtil.getProfileUrlBySlug = function(slug) {
  return Meteor.absoluteUrl()+'users/' + slug;
}
UserUtil.getTwitterName = function(user){
  // return twitter name provided by user, or else the one used for twitter login
  if(URLUtil.checkNested(user, 'profile', 'twitter')){
    return user.profile.twitter;
  }else if(URLUtil.checkNested(user, 'services', 'twitter', 'screenName')){
    return user.services.twitter.screenName;
  }
  return null;
}
UserUtil.getGitHubName = function(user){
  // return github name provided by user, or else the one used for github login
  if(URLUtil.checkNested(user, 'profile', 'github')){
    return user.profile.github;
  }else if(URLUtil.checkNested(user, 'services', 'github', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.github.screenName;
  }
  return null;
}
UserUtil.getGoogleName = function(user){
  // return google name provided by user, or else the one used for google login
  if(URLUtil.checkNested(user, 'profile', 'google')){
    return user.profile.google;
  }else if(URLUtil.checkNested(user, 'services', 'google', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.google.screenName;
  }
  return null;
}
UserUtil.getFacebookName = function(user){
  // return facebook name provided by user, or else the one used for facebook login
  if(URLUtil.checkNested(user, 'profile', 'facebook')){
    return user.profile.facebook;
  }else if(URLUtil.checkNested(user, 'services', 'facebook', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.facebook.screenName;
  }
  return null;
}
UserUtil.getTwitterNameById = function(userId){
  return UserUtil.getTwitterName(Meteor.users.findOne(userId));
}
UserUtil.getSignupMethod = function(user){
  if(user.services && user.services.twitter){
    return 'twitter';
  }else{
    return 'regular';
  }
}
UserUtil.getEmail = function(user){
  if(user.profile && user.profile.email){
    return user.profile.email;
  }else{ 
    return ''; 
  }
}
UserUtil.getAvatarUrl = function(user){
  if(UserUtil.getSignupMethod(user)=='twitter'){
    return 'http://twitter.com/api/users/profile_image/'+user.services.twitter.screenName;
  }else{
    return Gravatar.getGravatar(user, {
      d: 'http://demo.telesc.pe/img/default_avatar.png',
      s: 80
    });
  }
}
UserUtil.getCurrentUserEmail = function(){
  return Meteor.user() ? UserUtil.getEmail(Meteor.user()) : '';
}
UserUtil.userProfileComplete = function(user) {
  return !!UserUtil.getEmail(user);
}

UserUtil.findLast = function(user, collection){
  return collection.findOne({userId: user._id}, {sort: {createdAt: -1}});
}
UserUtil.timeSinceLast = function(user, collection){
  var now = new Date().getTime();
  var last = UserUtil.findLast(user, collection);
  if(!last)
    return 999; // if this is the user's first post or comment ever, stop here
  return Math.abs(Math.floor((now-last.createdAt)/1000));
}
UserUtil.numberOfItemsInPast24Hours = function(user, collection){
  var mDate = moment(new Date());
  var items=collection.find({
    userId: user._id,
    createdAt: {
      $gte: mDate.subtract('hours',24).valueOf()
    }
  });
  return items.count();
}
UserUtil.getUserSetting = function(setting, defaultValue, user){
  var user = (typeof user == 'undefined') ? Meteor.user() : user;
  var defaultValue = (typeof defaultValue == "undefined") ? null: defaultValue;
  var settingValue = UserUtil.getProperty(user.profile, setting);
  return (settingValue == null) ? defaultValue : settingValue;
}
UserUtil.getProperty = function(object, property){
  // recursive function to get nested properties
  var array = property.split('.');
  if(array.length > 1){
    var parent = array.shift();
    // if our property is not at this level, call function again one level deeper if we can go deeper, else return null
    return (typeof object[parent] == "undefined") ? null : UserUtil.getProperty(object[parent], array.join('.'))
  }else{
    // else return property
    return object[array[0]];
  }
}

UserUtil.getLocale = function(user) {
  return user == undefined || user.profile.locale == undefined ? 'en' : user.profile.locale;
}

UserUtil.getBio = function(user) {
  return user.profile.bio;
}
