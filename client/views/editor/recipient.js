var filename="client/views/editor/recipient.js";

//This will be used to convert the html to markdown in case it is ckEditor that user has selected
Template.recipient.events({
  'click .store' : function(event){
    var content = 'undefined';
    var markdown = 'undefined';
    var editor_choice = $('input[name=editorPref]:checked').val();
    if(editor_choice === QollConstants.EDITOR_MODE.HTML) {
      content = $( 'textarea#editor' ).val();


      //This method is added here only for display in log purpose. Remove it at some point of time.
      //No need to call a server side function to get value and then send it to the server. 
      //Convert the value on the server
      markdown = toMarkdown(content);


    }
    qlog.info('Storing the qoll now - ' + content, filename);
    qlog.info('Storing the qoll now (markdown) - ' + markdown, filename);
  },
  'click .send' : function(event){
    var content = 'undefined';
    var markdown = 'undefined';
    var editor_choice = $('input[name=editorPref]:checked').val();
    if(editor_choice === QollConstants.EDITOR_MODE.HTML) {
      content = $( 'textarea#editor' ).val();

      //This method is added here only for display in log purpose. Remove it at some point of time.
      //No need to call a server side function to get value and then send it to the server. 
      //Convert the value on the server
      markdown = toMarkdown(content);


    }
    qlog.info('Sending the qoll now - ' + content, filename);
    qlog.info('Storing the qoll now (markdown) - ' + markdown, filename);
  },
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