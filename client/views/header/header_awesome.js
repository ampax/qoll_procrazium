var filename = "client/views/header/header_awesome.js";

Template.header_awesome.helpers({
    my_profile : function() {
        return '/users/'+Meteor.user().profile.slug;
        //return '/users/'+Meteor.user().slug;
    },
    show_searchbox : function() {
        var name = Router.current().route? Router.current().route.getName() : undefined;
        return name && Meteor.userId() && (name === 'all_qolls_folder' || name === 'view_sent');
    },
    placeholder_txt : function() {
        // all_qolls_folder
        var name = Router.current().route.getName();
        qlog.info('####################################################=> ' + name, filename);
        
        return      name === 'all_qolls_folder' ? 'Search from all Qolls ...' 
                    : name === 'view_sent'? 'Search from all Questionnaires ...' 
                    :  'Input text to start searching ... (' + name + ')';
    },
    searchbox_val : function() {
        var name = Router.current().route? Router.current().route.getName(): undefined;
        return name && name === 'all_qolls_folder' && Session.get('qoll-search-box-text') ?Session.get('qoll-search-box-text')
                                : name && name === 'view_sent' && Session.get('questionnaire-search-box-text') ? Session.get('questionnaire-search-box-text') : '';
    },
    isAdmin : function() {
        /**Meteor.call("isAdmin", function(err, val) {
          if (err) {
            qlog.info('Error on isAdmin...' + err, filename);
            return false;
          } else {
            qlog.info('isAdmin ...' + val,filename);
            return val;
          }
        });
        return false; **/

        if(!Meteor.user()) return false;

        var email = Meteor.user().profile.email;

        return _.indexOf(['procrazium@gmail.com', 'cozenlabs@gmail.com'], email) != -1;
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
    'keyup #search-box': function(e) {
        delay(function(){
        var text = $(e.target).val().trim();
        qlog.info('Searching qolls for text - ' + text, filename);

        var name = Router.current().route.getName();        

        if(text && text != null && text != '') {
            // setting the value in session to serch for the inserted text and this will take precedence
            if(name === 'all_qolls_folder') Session.set('qoll-search-box-text', text);
            else Session.set('questionnaire-search-box-text', text);
            Session.set('selected-topics', undefined);
        } else {
            if(name === 'all_qolls_folder') Session.set('qoll-search-box-text', undefined);
            else Session.set('questionnaire-search-box-text', undefined);
        }

        if(name === 'all_qolls_folder') QollSearch.search(text);
        else QuestionnaireSearch.search(text);
        }, 1000);

      },
    'keyup #search-box1': _.throttle(function(e) {
        var text = $(e.target).val().trim();
        qlog.info('Searching qolls for text - ' + text, filename);        

        if(text && text != null && text != '') {
            // setting the value in session to serch for the inserted text and this will take precedence
            Session.set('qoll-search-box-text', text);
            Session.set('selected-topics', undefined);
        } else {
            Session.set('qoll-search-box-text', undefined);
        }

        QollSearch.search(text);

      }, 5000),
   /* 'click .dsb': function() {
    event.preventDefault();
    Router.go('dashboard');
    }*/
});

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function(event) {
        Router.go('/users/'+Meteor.user().profile.slug+'/edit');
    },
    'click #login-buttons-view-profile': function(event) {
        Router.go('/users/'+Meteor.user().profile.slug);
    },
});