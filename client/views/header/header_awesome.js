var filename = "client/views/header/header_awesome.js";

Template.header_awesome.helpers({
    my_profile : function() {
        return '/users/'+Meteor.user().profile.slug;
        //return '/users/'+Meteor.user().slug;
    },
});

Template.header_awesome.events({
    'click #login-buttons-logout' : function(event, tmpl) {
    
     qlog.info('User logout event happened', filename);
     Login.logoutFromService();
    },
    'click #login-buttons-facebook' : function(event, tmpl) {
        Login.loginWithService('facebook');
    },
    'click #login-buttons-google' : function(event, tmpl) {
        Login.loginWithService('google');
    },
    'click .btn-Google1' : function(event, tmpl) {
        Login.loginWithService('google');
    },
   /* 'click .dsb': function() {
    event.preventDefault();
    Router.go('dashboard');
    }*/
});

Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function(event) {
        Router.go('/users/'+Meteor.user().profile.slug+'/edit');
    },
    'click #login-buttons-view-profile': function(event) {
        Router.go('/users/'+Meteor.user().profile.slug);
    },
});