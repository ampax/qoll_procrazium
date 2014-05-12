var filename="client/views/users/user_edit.js";

Template.user_edit.helpers({
  profileIncomplete : function() {
    return this && !this.loading && !UserUtil.userProfileComplete(this);
  },
  userName: function(){
    return UserUtil.getUserName(this);
  },
  userEmail : function(){
    return UserUtil.getEmail(this);
  },
  userBio : function(){
    return UserUtil.getBio(this);
  },
  getTwitter: function(){
    return UserUtil.getTwitterName(this) || "";
  },
  getGitHub: function(){
    return UserUtil.getGitHubName(this) || "";
  },
  getGoogle: function(){
    return UserUtil.getGoogleName(this) || "";
  },
  getFacebook: function(){
    return UserUtil.getFacebookName(this) || "";
  },
  profileUrl: function(){
    return Meteor.absoluteUrl()+"users/"+this.slug;
  },
  hasNotificationsUsers : function(){
    return UserUtil.getUserSetting('notifications.users', '', this) ? 'checked' : '';
  },
  hasNotificationsPosts : function(){
    return UserUtil.getUserSetting('notifications.posts', '', this) ? 'checked' : '';
  },
  hasNotificationsComments : function(){
    return UserUtil.getUserSetting('notifications.comments', '', this) ? 'checked' : '';
  },
  hasNotificationsReplies : function(){
    return UserUtil.getUserSetting('notifications.replies', '', this) ? 'checked' : '';
  },
  isLocale: function(locale) {
    qlog.info('locale - ' + locale, filename);
    return UserUtil.getLocale(this) === locale ? 'checked' : '';
  },
  isState: function(state, user) {
    return UserUtil.getState(user) === state.state_code ? 'selected' : '';
  },
  isCountry: function(country, user) {
    return UserUtil.getCountry(user) === country.country_code ? 'selected' : '';
  },
  isSex: function(sex) {
    return UserUtil.getSex(this) === sex ? 'selected' : '';
  },
  statesForCountry: function(country) {
    return country === 'USA' ? us_states : undefined;
  },
  countries: function(country) {
    return countries;
  },
})

Template.user_edit.events({
  'submit form': function(e){
    e.preventDefault();

    //clearSeenErrors();
    if(!Meteor.user())
      throwError(i18n.t('You must be logged in.'));

    qlog.info('Printig e.target - ' + e.target, filename)

    var $target=$(e.target);
    var name = $target.find('[name=name]').val();
    var user = this;
    var update = {
      "profile.name": name,
      "profile.name_slug": URLUtil.slugify(name),
      "profile.slug": URLUtil.slugify($target.find('[name=username]').val()),
      "profile.bio": $target.find('[name=bio]').val(),
      "profile.email": $target.find('[name=email]').val(),
      "profile.twitter": $target.find('[name=twitter]').val(),
      "profile.google": $target.find('[name=google]').val(),
      "profile.facebook": $target.find('[name=facebook]').val(),
      "profile.github": $target.find('[name=github]').val(),
      "profile.site": $target.find('[name=site]').val(),
      "profile.locale": $('input[name=locale]:checked').val(),

      "profile.dob": $target.find('input[name=dob]').val(),
      "profile.sex": $("select#sex option:selected").val(),
      "profile.state": $('select#state option:selected').val(),
      "profile.country": $('select#country option:selected').val(),
      //"profile.notifications.users": $('input[name=notifications_users]:checked').length, // only actually used for admins
      //"profile.notifications.posts": $('input[name=notifications_posts]:checked').length,
      //"profile.notifications.comments": $('input[name=notifications_comments]:checked').length,
      //"profile.notifications.replies": $('input[name=notifications_replies]:checked').length,
      "inviteCount": parseInt($target.find('[name=inviteCount]').val())
    };

    qlog.info(update);

    var old_password = $target.find('[name=old_password]').val();
    var new_password = $target.find('[name=new_password]').val();

    if(old_password && new_password){
   		Accounts.changePassword(old_password, new_password, function(error){
        if(error)
          //throwError(error.reason);
          qlog.error('Error occured while changing password - '+error.reason, filename);
      });
    }

    Meteor.users.update(user._id, {
      $set: update
    }, function(error){
      if(error){
        //throwError(error.reason);
        qlog.error('Error happened while saving - '+error.reason, filename);
      } else {
        //throwError(i18n.t('Profile updated'));
        qlog.error('User data saved', filename);
      }
      Deps.afterFlush(function() {
        //var element = $('.grid > .error');
        //$('html, body').animate({scrollTop: element.offset().top});
      });
    });
  }

});


Template.user_edit.rendered = function(){
    $( "#dob" ).datepicker();
};

