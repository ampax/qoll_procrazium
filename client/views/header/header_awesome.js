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
    checkEditorMode : function(mode) {
        settings = Settings.find({'userId' : Meteor.userId()}).fetch()[0];
        // qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
        var flag = settings ? settings.editor_mode && settings.editor_mode === mode : false;
        qlog.info(mode + ' - ' + flag);
        return settings ? settings.editor_mode && settings.editor_mode === mode : false;
    },
    checkQollTemplate : function(this_template) {
        settings = Settings.findOne({'userId' : Meteor.userId()});

        if(!Session.get('qoll_template'))
            if(!settings) Session.set('qoll_template', 'wiki');
            else Session.set('qoll_template', settings.qoll_template? settings.qoll_template : 'wiki');
        qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
        var flag = settings ? settings.qoll_template && settings.qoll_template === this_template : false;
        
        return flag===true? 'checked':'';
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
      'click input[name=qoll_template]' : function(e) {
        e.preventDefault();
        var qoll_template = $('input:radio[name=qoll_template]:checked').val();
        qlog.info('Selecting template ' + qoll_template, filename);

        var settings = Settings.findOne({ 'userId' : Meteor.userId() });
        qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);

        if (settings) {

            Settings.update({ _id : settings._id }, { $set : { 'qoll_template' : qoll_template } }, function(error) {
                if (error) {
                    //throwError(error.reason);
                    qlog.error('Error happened while saving qoll_template-preferences ' + qoll_template + ', error - ' + error.reason, filename);
                } else {
                    qlog.info('Saved qoll_template = ' + qoll_template + ' to preferences', filename);
                }
            });
        } else {
            Settings.insert({ 'userId' : Meteor.userId(), 'qoll_template' : qoll_template });
        }

        Session.set('qoll_template', qoll_template);

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