Template.nav_cordova.events({

    'click #signout' : function(e, t){
      e.preventDefault();

      Meteor.logout(function(error) {
        if (error) {
          // Display the logout error to the user however you want
        } else {
          Router.go('landing_signin');
        }
      });
    }
});