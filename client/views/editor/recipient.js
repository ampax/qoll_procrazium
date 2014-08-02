var filename="client/views/editor/recipient.js";

Template.recipient.helpers({
  is_pub : function(){
    return checkDefaultAccessMode(QollConstants.QOLL.VISIBILITY.PUB) ? 'checked' : '';
  },
  is_pvt : function(){
    return checkDefaultAccessMode(QollConstants.QOLL.VISIBILITY.PVT) ? 'checked' : '';
    
  },
});

//This will be used to convert the html to markdown in case it is ckEditor that user has selected
Template.recipient.events({
  'click .store' : function(event){
    var content = 'undefined';
    var markdown = 'undefined';
    var access = $("input:radio[name=attribute_access]:checked").val();
    var recips = jQuery("input#recipient_search").val();
    var tags = jQuery("input.tags").val();
    var editor_choice = $('input[name=editorPref]:checked').val();

    if(tags == undefined || tags === '') {
      Error.message(QollConstants.MSG_TYPE.ERROR, 'Tags is required. Start typing the tags to autofill and select to continue.');
      return;
    }
    
    if(editor_choice === QollConstants.EDITOR_MODE.HTML) {
      content = $( 'textarea#editor' ).val();


      //This method is added here only for display in log purpose. Remove it at some point of time.
      //No need to call a server side function to get value and then send it to the server. 
      //Convert the value on the server
      markdown = toMarkdown(content);

      Meteor.call("processStoreHtmlQoll", content, recips, tags, QollConstants.QOLL_ACTION_STORE, access, function(error, msg){
        if(error) {
          qlog.error('Error occured while converting - ' + content + '/n to markdown - ' + error, filename);
        } else {
          qlog.info('Recieved message - ' + msg, filename);
        }
      });


    }
    qlog.info('Storing the qoll now - ' + content, filename);
    qlog.info('Storing the qoll now (markdown) - ' + markdown, filename);
  },
  'click .send' : function(event){
    var content = 'undefined';
    var markdown = 'undefined';
    var access = $("input:radio[name=attribute_access]:checked").val();
    var recips = jQuery("input#recipient_search").val();
    var tags = jQuery("input.tags").val();
    var editor_choice = $('input[name=editorPref]:checked').val();

    if(tags == undefined || tags === '') {
      Error.message(QollConstants.MSG_TYPE.ERROR, 'Tags is required. Start typing the tags to autofill and select to continue.');
      return;
    }
    
    if(editor_choice === QollConstants.EDITOR_MODE.HTML) {
      content = $( 'textarea#editor' ).val();

      //This method is added here only for display in log purpose. Remove it at some point of time.
      //No need to call a server side function to get value and then send it to the server. 
      //Convert the value on the server
      markdown = toMarkdown(content);

      Meteor.call("processStoreHtmlQoll", content, recips, tags, QollConstants.QOLL_ACTION_SEND, access, function(error, msg){
        if(error) {
          qlog.error('Error occured while converting - ' + content + '/n to markdown - ' + error, filename);
        } else {
          qlog.info('Recieved message - ' + msg, filename);
        }
      });


    }
    qlog.info('Sending the qoll now - ' + content, filename);
    qlog.info('Storing the qoll now (markdown) - ' + markdown, filename);
  },
  "click input[name = 'attribute_access']" : function(event) {
    var access_mode = $("input:radio[name=attribute_access]:checked").val();
    if(access_mode == undefined || access_mode == '') {
      access_mode = QollConstants.QOLL.VISIBILITY.PUB; //default the editor choice to basic
    }
    qlog.info('Switching to editor mode - ' + access_mode, filename);
    
    settings = Settings.find({'userId' : Meteor.userId()}).fetch();
      if(settings && settings.length > 0) {
        //Settings.update({'access_mode': QollConstants.EDITOR_MODE.BASIC});
        /**
        QollConstants.QOLL.VISIBILITY.PUB - 'public' qolls created, will be shared publicly
        QollConstants.QOLL.VISIBILITY.PVT - 'private' qolls created, will not be shared publicly
        **/

        Settings.update({_id : settings[0]._id}, {
          $set: {'access_mode': access_mode}
        }, function(error){
          if(error){
            //throwError(error.reason);
            qlog.error('Error happened while saving editor-preferences '+access_mode+', error - '+error.reason, filename);
          } else {
            qlog.info('Saved access_mode = '+access_mode+' to preferences', filename);
          }
        });
      } else {
          Settings.insert({'userId' : Meteor.userId(), 'access_mode': QollConstants.QOLL.VISIBILITY.PUB});
      }
  }
});

Template.recipient.rendered = function() {
	qlog.info("Initializing autocomplete ... ", filename);
	Meteor.subscribe('RECIPIENTS_PUBLISHER');
	QollAutoComplete.init("input#recipient_search");
	QollAutoComplete.enableLogging = true;
};


Template.recipient.events({
  'keyup .recipient': function () {

    QollAutoComplete.autocomplete({
      element: 'input#recipient_search',       // DOM identifier for the element
      collection: Recipients,              // MeteorJS collection object (published object)
      field: 'groupName',                    // Document field name to search for
      limit: 0,                         // Max number of elements to show
      sort: { groupName: 1 },
      mode: 'multi',
      delimiter: ';'
    });              // Sort object to filter results with
      //filter: { 'gender': 'female' }}); // Additional filtering
  }, 
  'keyup .tags': function(){
    //TODO: Add google like tag class to the tags here
  },
  'click .qollQbankToggle': function(){
  	if (Session.get('disable_sendtoQbank')) return;
  	if( $('.qollQbankToggle').html().indexOf('Qoll To:')>-1 ){
  		$('.qollQbankToggle').html($('.qollQbankToggle').html().replace('Qoll To:','Qbank:  '));
  		$('.recipient').val('qbank@qoll.io');
  		$(".recipient").prop('disabled', true);
  		$('.toolbar-sendqoll').hide();
  	}else{
  		$("input").prop('disabled', false);
  		$('.qollQbankToggle').html($('.qollQbankToggle').html().replace('Qbank:  ','Qoll To:'));
  		$('.recipient').val('');
  		$('.toolbar-sendqoll').show();
  	}
  }
});

var toMarkdown = function(html) {
   Meteor.call("toMarkdown", html, function(error, md){
      if(error) {
        qlog.error('Error occured while converting - ' + html + '/n to markdown - ' + error, filename);
      } else {
        qlog.info('Recieved md - ' + md, filename);
        return md;
      }
    });
}

var checkDefaultAccessMode = function(mode) {
  settings = Settings.find({'userId' : Meteor.userId()}).fetch()[0];
  qlog.info('printing settings - ' + JSON.stringify(settings) + ', userId - ' + Meteor.userId(), filename);
  var flag = settings ? settings.access_mode && settings.access_mode === mode : false;
  qlog.info('is_adv - ' + flag);
  return settings ? settings.access_mode && settings.access_mode === mode : false;
}