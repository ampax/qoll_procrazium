Template.userProfile.helpers({
  avatarUrl: function() {
    return UserUtil.getAvatarUrl(this);
  },
  canEditProfile: function() {
    var currentUser = Meteor.user();
    return currentUser && (this._id == currentUser._id || UserUtil.isAdmin(currentUser));
  },
  createdAtFormatted: function() {
    return this.createdAt;
  },
  canInvite: function() {
    // if the user is logged in, the target user hasn't been invited yet, invites are enabled, and user is not viewing their own profile
    return Meteor.user() && Meteor.user()._id != this._id && !UserUtil.isInvited(this) && UserUtil.invitesEnabled() && UserUtil.canInvite(Meteor.user());
  },
  inviteCount: function() {
    return Meteor.user().inviteCount;
  },
  getTwitterName: function () {
    return UserUtil.getTwitterName(this);
  },
  getGoogle: function () {
    return UserUtil.getGoogleName(this);
  },
  getFacebookName: function () {
    return UserUtil.getFacebookName(this);
  },
  getGitHubName: function () {
    return UserUtil.getGitHubName(this);
  },
  editMyProfile : function() {
    qlog.info('========================================');
      return '/users/'+Meteor.user().profile.slug+'/edit';
      //return '/users/'+Meteor.user().slug;
  },
});

Template.userProfile.events({
  'click .invite-link': function(e, instance){
    Meteor.call('inviteUser', instance.data.user._id);
    throwError('Thanks, user has been invited.');
  }
});