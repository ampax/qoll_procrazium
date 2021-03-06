Template.signin.events({
    'click input[type=submit]': function(event){
      event.preventDefault();
      var username = $('#username').val();
      var password = $('#password').val();
      qlog.info('Logging in with credentials - ' + username + '/' + password);
      Meteor.loginWithPassword(username, password, function(err){
        if(err){
          console.error(err);
          throwError(err.reason);
        }
      });
  },

  'click #signup': function(){
      // Session.set('state', 'signup');
      Router.go('/signup');
  },

  'click .twitter-button': function(){
    Meteor.loginWithTwitter(function(){
      Router.go('/');
    });
  }
}); 