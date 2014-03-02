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
    console.log("Store qoll at this event aljkhdflakjsd ...");
    var editor = ace.edit("aceEditor");
    var recips = jQuery("input#recipient_search").val();
    parseAndAddQoll(editor, recips);
  }, 
});


var parseAndAddQoll = function(editor, recips) {
  qlog.info("Recips list is: " + recips, filename);
  //parsing and saving the qolls now
  var qollMasterContent = editor.getValue();

  qollMasterContent = editor.getValue(); // or session.getValue

  Meteor.call("addQollMaster", qollMasterContent, function(error, qollMasterId){
      qlog.info("Added qoll-master-content with id: " + qollMasterId, filename);
  });
  
};