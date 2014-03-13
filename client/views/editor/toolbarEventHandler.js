var filename="toolbarEventHandler.js";

Template.toolbar.events({
  'click .addqoll': function(event){
    event.preventDefault();
    var editor = ace.edit("aceEditor");
    bindToolBarForQoll(editor);
  },'click .addopti': function(){
    var editor = ace.edit("aceEditor");
    bindToolBarForOption(editor);
  },'click .addltxi': function(){
    var editor = ace.edit("aceEditor");
    bindForLatexInline(editor);
  },'click .addltxb': function(){
    var editor = ace.edit("aceEditor");
    bindForLatexBlock(editor);
  },'click .addcode': function(){
    var editor = ace.edit("aceEditor");
    bindForCode(editor);
  },'click .addbloc': function(){
    var editor = ace.edit("aceEditor");
    bindForBlockQuotes(editor);
  },'click .sendqoll': function(){
    console.log("Send qoll at this event ...");
  },'click .storqoll': function(){
    console.log("Store qoll at this event ...");
    var editor = ace.edit("aceEditor");
    var qoll_editor_content = editor.getValue();
    var recips = jQuery("input#recipient_search").val();

    storeEditorContents(editor, recips);
  },'click .previewqoll': function(){
    console.log("Preview qoll at this event ...");
    var editor = ace.edit("aceEditor");
    var qoll_editor_content = editor.getValue();
    Meteor.call('downtown', qoll_editor_content, downtowm_default, function(err, val){
      qlog.info("Rec data from server: " + val, filename);
      if(err) {
        qoll_editor_content = "Error occured while converting qoll-contents. Please try again.";
      } else {
        qoll_editor_content = val;
      }
      //previewQoll(qoll_editor_content);
    });
    
    if(jQuery("#aceEditor").hasClass("is-invisible")) {
      qlog.info("Showing ace editor ...", filename);
      jQuery("#aceEditor").removeClass("is-invisible");
      jQuery("#aceEditor_Preview").addClass("is-invisible");
    } else {
      qlog.info("Hiding ace editor ...", filename);
      jQuery("#aceEditor").addClass("is-invisible");
      jQuery("#aceEditor_Preview").removeClass("is-invisible")
      
    }
    
  },'click .checkqoll': function(){
    console.log("Check correct item in qoll at this event ...");
  },
});


/** Manage various events for storing the qoll contents **/
var storeEditorContents = function(editor, recips) {
  var editor_content = editor.getValue();
  var target = jQuery(".toolbar-storqoll");
  var store_html = target.html();
  target.html("<i class='fa fa-spinner fa-spin toolbar-buttons-link'></i>Saving...");

  var emailsandgroups=[];
  $.each(recips.split(/;|,/),function (ix,email){
    email=$.trim(email);
    if(email.length>0){
      emailsandgroups.push(email);
    }
  });

  Meteor.call("addQollMaster", editor_content, emailsandgroups, function(error, qollMasterId){
    if(error) {
      qlog.info('Error occured storing the master qoll. Please try again.', filename);
      target.html("Failed, try again...");
      target.fadeOut( 1600, function(){
        target.html(store_html);
      });
      return -1;
    } else {
      qlog.info("Added qoll-master-content with id: " + qollMasterId, filename);
      target.html("Qoll Saved...");
      editor.setValue('', 1);
      target.fadeOut( 2400, function(){
        //setTimeout(function(){
          target.html(store_html);
          target.removeAttr("style");
        //}, 800);
        qlog.info('Adding store-qoll button back: ' + store_html, filename);
      });
      return qollMasterId;
    }
  });
};

var previewQoll = function(val) {
  qlog.info("Preview the qoll content: " + val, filename);
  $("div#aceEditor_Preview").html(val);
}