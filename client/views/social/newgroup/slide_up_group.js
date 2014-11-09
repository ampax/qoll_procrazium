var filename='client/views/questionaire/slide_up_bank.js';
/*
 * JQuery functions for slideout feedback form
 * 
 * Sets up a sliding form on click of a feedback button
 * On submit button will send the data to a php script
 *
 */

 Template.slide_up_group.rendered = function() {
  qlog.info("Initializing autocomplete ... ", filename);
  Meteor.subscribe('RECIPIENTS_PUBLISHER');
  QollAutoComplete.init("input#recipient_search");
  QollAutoComplete.enableLogging = false;
};

 Template.slide_up_group.events({
  'click div.slider' : function() {
    qlog.info('Clicked on the slider div');
    //$( "div.slider" ).slideToggle();
  },
  'click button.create' : function() {
    
    qlog.info('Clicked on the create button ...', filename);
    var group_desc = jQuery("input.group-desc").val();
    var group_name = jQuery("input#group-name").val();
    var group_memb = jQuery("input#members").val();
    var group_domn = jQuery("input#domain").val();

    var access = $("input:radio[name=attribute_access]:checked").val();
    var invt = $("input:radio[name=attribute_invt]:checked").val();
    var size = $("input:radio[name=attribute_size]:checked").val();
    var ended = $("input:radio[name=attribute_ended]:checked").val();

    var user_emails = [];
    if(group_memb) {
      $.each(group_memb.split(/;|,/), function(ix, email) {
        email = $.trim(email);
        if (email.length > 0) {
          user_emails.push(email);
        }
      });
    }

    //var access = $("input:radio[name=attribute_access]:checked").val();
    //var recips = jQuery("input#recipient_search").val();
    //var tags = jQuery("input.tags").val();
    //var editor_choice = $('input[name=editorPref]:checked').val();

    qlog.info('Clicked on the create button ... ' + group_desc + '/' + group_name + '/' + group_memb + '/' + group_domn, filename);
    qlog.info('Clicked on the create button ... ' + access + '/' + invt + '/' + size + '/' + ended, filename);

    Meteor.call("updateCreateUserGroup", group_name, group_desc, user_emails, group_domn, access, invt, size, ended, function(error, gid){
        if(!error){ 
            qlog.info("Updated/created users with group-id: " + gid, filename);
        } else {
            qlog.info("Failed to create group: " + error, filename);
            jQuery("input.group-desc").val('');
            jQuery("input#group-name").val('');
            jQuery("input#members").val('');
            jQuery("input#domain").val('');
        }
        
    });
  }
 });

