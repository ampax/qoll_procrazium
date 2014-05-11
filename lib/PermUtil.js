var filename='lib/PermUtil.js';

/*************************************************/

  /*Global Permission-Util Functions for Qoll*/

/*************************************************/

PermUtil = {};

// Permissions

// user:                Defaults to Meteor.user()
// returnError:         If there's an error, should we return what the problem is?
// 
// return true if all is well, false || an error string if not
PermUtil.canView = function(user){
  // console.log('canView', 'user:', user, 'returnError:', returnError, getSetting('requireViewInvite'));

  if(URLUtil.getSetting('requireViewInvite', false)){

    if(Meteor.isClient){
      // on client only, default to the current user
      var user=(typeof user === 'undefined') ? Meteor.user() : user;

      // return false until settings have loaded
      if(!Session.get('settingsLoaded'))
        return false;
    }

    if(user && (UserUtil.isAdmin(user) || UserUtil.isInvited(user))){
      // if logged in AND either admin or invited
      return true;
    }else{
      return false;
    }

  }
  return true;
}
PermUtil.canViewById = function(userId, returnError){
  // if an invite is required to view, run permission check, else return true
  if(URLUtil.getSetting('requireViewInvite', false)){
    // if user is logged in, then run canView, else return false
    return userId ? PermUtil.canView(Meteor.users.findOne(userId), returnError) : false;
  }
  return true;
}
PermUtil.canPost = function(user, returnError){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;

  // console.log('canPost', user, action, getSetting('requirePostInvite'));
  if(Meteor.isClient && !Session.get('settingsLoaded'))
    return false;
  
  if(!user){
    return returnError ? "no_account" : false;
  } else if (UserUtil.isAdmin(user)) {
    return true;
  } else if (URLUtil.getSetting('requirePostInvite')) {
    if (user.isInvited) {
      return true;
    } else {
      return returnError ? "no_invite" : false;
    }
  } else {
    return true;
  }
}
PermUtil.canPostById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return PermUtil.canPost(user, returnError);
}
PermUtil.canComment = function(user, returnError){
  return PermUtil.canPost(user, returnError);
}
PermUtil.canCommentById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return PermUtil.canComment(user, returnError);
}
PermUtil.canUpvote = function(user, collection, returnError){
  return PermUtil.canPost(user, returnError);
}
PermUtil.canUpvoteById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return PermUtil.canUpvote(user, returnError);
}
PermUtil.canDownvote = function(user, collection, returnError){
  return PermUtil.canPost(user, returnError);
}
PermUtil.canDownvoteById = function(userId, returnError){
  var user = Meteor.users.findOne(userId);
  return PermUtil.canDownvote(user, returnError);
}
PermUtil.canEdit = function(user, item, returnError){
  var user=(typeof user === 'undefined') ? Meteor.user() : user;
  
  if (!user || !item){
    return returnError ? "no_rights" : false;
  } else if (UserUtil.isAdmin(user)) {
    return true;
  } else if (user._id!==item.userId) {
    return returnError ? "no_rights" : false;
  }else {
    return true;
  }
}
PermUtil.canEditById = function(userId, item){
  var user = Meteor.users.findOne(userId);
  return PermUtil.canEdit(user, item);
}
PermUtil.currentUserCanEdit = function(item) {
  return PermUtil.canEdit(Meteor.user(), item);
}
PermUtil.canInvite = function(user){
  return UserUtil.isInvited(user) || UserUtil.isAdmin(user);
}