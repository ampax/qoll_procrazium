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
    var editor = ace.edit("aceEditor");
    var qoll_editor_content = editor.getValue();
    var recips = jQuery("input#recipient_search").val();

    storeEditorContents(editor, recips, "send");
  },'click .storqoll': function(){
    console.log("Store qoll at this event ...");
    var editor = ace.edit("aceEditor");
    var qoll_editor_content = editor.getValue();
    var recips = jQuery("input#recipient_search").val();

    storeEditorContents(editor, recips, "store");
  },'click .previewqoll': function(event){
    event.preventDefault();

    var editor = ace.edit("aceEditor");
    var parsed_qoll;
    Meteor.call('parse_downtown', editor.getValue(), DownTownOptions.downtown_default(), function(err, val){
      qlog.info("Rec data from server: " + JSON.stringify(val), filename);
      if(err) {
        parsed_qoll = "Error occured while converting qoll-contents. Please try again: " + err;
        previewQoll(parsed_qoll);
      } else {
        parsed_qoll = val;
      previewQoll(preparePreviewHtml(parsed_qoll));
      }
    });
    
    if(jQuery("#aceEditor").hasClass("is-invisible")) {
      qlog.info("Showing ace editor ...", filename);
      jQuery("#aceEditor").removeClass("is-invisible");
      jQuery("#aceEditor_Preview").addClass("is-invisible");
      jQuery('a.previewqoll > i').addClass("glyphicon-eye-open");
      jQuery('a.previewqoll > i').removeClass("glyphicon-eye-close");
    } else {
      qlog.info("Hiding ace editor ...", filename);
      jQuery("#aceEditor").addClass("is-invisible");
      jQuery("#aceEditor_Preview").removeClass("is-invisible")
      jQuery('a.previewqoll > i').removeClass("glyphicon-eye-open");
      jQuery('a.previewqoll > i').addClass("glyphicon-eye-close");
      
    }
    
  },'click .checkqoll': function(){
    console.log("Check correct item in qoll at this event ...");
    var editor = ace.edit("aceEditor");
    bindToolBarForQollAnswer(editor);
  },
});


/** Manage various events for storing the qoll contents **/
var storeEditorContents = function(editor, recips, action) {
  
  if($.trim(recips) === '') {
    var err_target = jQuery(".toolbar-error-msg");
    err_target.html('Add recipients to save the qoll please ...');
    err_target.fadeOut( 6400, function(){
      err_target.html('');
      err_target.removeAttr("style");
    });
    return;
  }

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

  Meteor.call("addQollMaster", editor_content, emailsandgroups, action, function(error, qollMasterId){
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
      jQuery("input#recipient_search").val('');
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
  $("div#aceEditor_Preview").html(val);
};

var preparePreviewHtml = function (qolls){
  var html = '';
  qolls.map(function(qoll) {
    html += "<div class='col-md-12 col-xs-12 list-group-item bg-qoll qoll-seperator'>";
    if(qoll.qoll_star_attributes[QollConstants.EDU.TITLE]) {
      html += '<h4>'+qoll.qoll_star_attributes[QollConstants.EDU.TITLE]+'</h4>';
    }
    html += '<h5>'+qoll['qoll']+'</h5>';
    if(qoll.qoll_star_attributes[QollConstants.EDU.UNITS]) {
      html += getUnitsHtml(qoll.qoll_star_attributes[QollConstants.EDU.UNIT_NAME], qoll.qoll_star_attributes[QollConstants.EDU.UNITS]);
    }
    if(qoll.qoll_star_attributes[QollConstants.EDU.HINT]) {
      html += getHintHtml(qoll.qoll_star_attributes[QollConstants.EDU.HINT]);
    }
    html +="</div>";
    var types = qoll['types'];
    var idx = 0;
    if(types.length > 1) {
      types.map(function(t){
        if(t.isCorrect) {
          html += "<div class='col-md-12 col-xs-12 list-group-item'>";
          html += "<span class='badge pull-left qoll-response-val class_" + idx + " glossy'>" + alphabetical[idx] + "</span>";
          html += t.type;
          //html += "</div>";
          //html+= "<div class='col-md-2 col-xs-2 list-group-item'>";
          html += "<i class='glyphicon glyphicon-check pull-right green'></i>";
          html += "</div>";
        } else {
          html += "<div class='col-md-12 col-xs-12 list-group-item'>";
          html += "<span class='badge pull-left qoll-response-val class_" + idx + " glossy'>" + alphabetical[idx] + "</span>";
          html += t.type;
          html += "</div>";
        }

        idx=idx+1;
      });
    } else if(types) {
      //this is a fill in the blanks question, create input boxes
      if(types.length === 0) {
        //this is inline fill in the blanks. find first ? and replace it with input box
        html = html.replace(/\?\=/g, getFillInTheBlanksHtml());
      } else if (types.length === 1) {
        qlog.info('Printing types - ' + types[0].type, filename);
        html += "<div class='col-md-12 col-xs-12 list-group-item'>";
        var tmp1 = types[0].type.replace(/\?\=/g, getFillInTheBlanksHtml());
        html += tmp1;
        html += "</div>";
      }
    }
  });
  return html;
};

var getFillInTheBlanksHtml = function() {
  var html = '<div class="input-group">'+
    '<input type="text" class="form-control" placeholder="Fill in the blanks ...">' +
    '</div>';
  return html;
};

var getUnitsHtml = function (unit_name, units) {
  var units_html = '<div class="input-group">';
  if(unit_name) units_html += unit_name+': ';
  else unit_name += 'Unit: ';
  units.map(function(unit){
    units_html += '<input name="unit" type="radio">' + unit;
  });
  units_html += '</div>';

  return units_html;
};

var getHintHtml = function (hint) {
  var hint_html = 
  '<button type="button" class="btn btn-warning pull-right" data-toggle="tooltip" data-placement="left" title="Partial credit will be deducted..." id="show_hint">' +
    'Hint' +
  '</button><div class="is-invisible red_1" id="hint">'+hint+'</div>';

  return hint_html;
};
