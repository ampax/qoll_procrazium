var filename='client/views/questionaire/slide_up_bank.js';


Template.registerHelper("sendOrStore", function() {
    return {
      stored: 'Store',
      sent : 'Send'
    };
});


// ---- hook
var QuestionnaireHooks = {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        
        var title = insertDoc.title;
        var tags = insertDoc.tags;
        var topics = insertDoc.topics;
        var end_time = insertDoc.end_time;
        var send_to = insertDoc.send_to;
        var state = insertDoc.state;

        var qoll_attributes = {};

        var allqollids = [];
        $('.qoll').each(function() {
          var qoll = $(this);
          qlog.info('Will be storing qoll with id: ' + qoll.id + '/' + this.id, filename);
          allqollids.push(this.id);

          qoll_attributes[this.id] = {};

          var wght = $(this).find('input.wght').val();
          var hint_penalty = $(this).find('input.hint_penalty').val();

          qoll_attributes[this.id]['weight'] = wght;
          if(hint_penalty) qoll_attributes[this.id]['hint_penalty'] = hint_penalty;

        });
        
        /**qlog.info("=======================================");
        console.log(qoll_attributes);
        qlog.info("=======================================");
        return false;**/

        if(allqollids.length == 0) {
          alert('Select qolls to create the questionnaire');
          return false;
        }

        var jsn = {title : title, tags : tags, topics : topics, end_time : end_time, recips : send_to, action : state, allqollids : allqollids, qoll_attributes : qoll_attributes};

        qlog.info(JSON.stringify(jsn), filename);

        createQuestionnaire(jsn)

        return false;

        // AutoForm.resetForm('questionnaireForm')

        // return true;
    },
};

AutoForm.addHooks('questionnaireForm', QuestionnaireHooks);








Template.slide_up_bank.helpers({
  customQuestionnaireSchema: function() {
    return Schemas.custom_questionnaire;
  },
  transform_txt : function(txt, cat, context, fib, tex, tex_mode, qoll_idx) {
    //method defined in preview.js
    var txt_1 = transform_fib(txt, cat, context, fib);

    //method defined in preview.js
      var txt_2 = transform_tex(txt_1, tex, tex_mode, qoll_idx);

      // txt_2 = txt_2 + "\\({a1x^3+z=0}\\)";

      return txt_2;
  },
});


Template.slide_up_bank.rendered = function() {
  qlog.info("Initializing autocomplete ... ", filename);
  Meteor.subscribe('RECIPIENTS_PUBLISHER');
  QollAutoComplete.init("input#recipient_search");
  QollAutoComplete.enableLogging = false;
};

 Template.slide_up_bank.events({
  'click div.slider' : function() {
    qlog.info('Clicked on the slider div');
    $( "div.slider" ).slideToggle();
  },
  'click button.toggle' : function() {
    qlog.info('Clicked on the span toggle.');
    $( "div.form-scroll-info" ).slideToggle();
    $( "div.form-static" ).slideToggle();
    $( "div.form-scroll" ).slideToggle();
    $( "div.pop-nav" ).slideToggle();
    $( "div.save-nav" ).slideToggle();
  },
  'click button.store' : function() {
    qlog.info('Clicked on store. Will be sending/storing the questonnaire at this point. ' , filename);

    var allqollids = [];
    $('.qoll').each(function() {
      var qoll = $(this);
      qlog.info('Will be storing qoll with id: ' + qoll.id + '/' + this.id, filename);
      allqollids.push(this.id);
    });

    var recips = jQuery("input#recipient_search").val();
    var title = jQuery("input.qollstionnaire-title").val();
    var tags = jQuery("input#add-tags").val();

    qlog.info('Printing other info from page - ' + recips + '/' + title + '/' + tags, filename);

    //recipients is a required field
    if ($.trim(recips) === '' || $.trim(title) === '' || allqollids.length == 0) {
      QollError.message(QollConstants.MSG_TYPE.ERROR, 'Select questions, add recipients and title to create qollstionnaire ...');
      return;
    }

    var tagArr=[];
    $.each(tags.split(/;|,|\s/),function (ix,tag){
      tag=$.trim(tag);
      if(tag.length>0){
        tagArr.push(tag);
      }
    });

    qlog.info('tags are - ' + tagArr, filename);
    var target = jQuery(".qbank-error-msg");
    var store_html = target.html();
    target.html("<i class='fa fa-spinner fa-spin toolbar-buttons-link'></i>Saving...");


    var emailsandgroups = [];
    $.each(recips.split(/;|,/), function(ix, email) {
      email = $.trim(email);
      if (email.length > 0) {
        emailsandgroups.push(email);
      }
    });

    var qollstionnaire = {};
    qollstionnaire.emails = emailsandgroups;
    qollstionnaire.title = title.trim();
    qollstionnaire.tags = tagArr;
    qollstionnaire.status = QollConstants.STATUS.STORED;

    qollstionnaire.qollids = allqollids;

    qlog.info('Will be storing the questionaire - ' + JSON.stringify(qollstionnaire), filename);

    Meteor.call("addQollstionnaire", emailsandgroups, title.trim(), tagArr, QollConstants.STATUS.STORED, allqollids, function(err, qollMasterId) {
      var target = jQuery(".qbank-error-msg");
      if (err) {
        qlog.info('Error occured storing the master qoll. Please try again.' + err, filename);
        target.html("Failed, try again...");
        target.fadeOut(1600, function() {
          //target.html(store_html);
        });
        return -1;
      } else {
        qlog.info("Added qoll-master-content with id: " + qollMasterId, filename);
        //Wipe out the values inserted in the slide-up editor now
        jQuery("input#recipient_search").val('');
        jQuery("input.qollstionnaire-title").val('');
        jQuery("input#add-tags").val('');
        jQuery("span#cnt").html('0');
        $('span.qoll-container').remove();

        if ($("#qollsenddate").val() != '') {
          var actdt = new Date($("#qollsenddate").val());
          var hour = parseInt($('.qstion_send_hour').val());
          var min = parseInt($('.qstion_send_min').val());
          if ($('.qstion_send_ampm').val() == 'PM' && hour<12) {
            hour = hour + 12;
          }
          if ($('.qstion_send_ampm').val() == 'AM' && hour==12) {
            hour = hour - 12;
          }

          actdt.setHours(hour,min);
          

          Meteor.call("addTimerAction", qollMasterId, actdt, 'send');
          qlog.info("Selected start or end date: " + $("#qollenddate").val() + $("#qollsenddate").val(), filename);

        }
        if ($("#qollenddate").val() != '') {
          var actdt = new Date($("#qollenddate").val());
          var hour = parseInt($('.qstion_end_hour').val());
          var min = parseInt($('.qstion_end_min').val());
          if ($('.qstion_end_ampm').val() == 'PM' && hour<12) {
            hour = hour + 12;
          }
          if ($('.qstion_end_ampm').val() == 'AM' && hour==12) {
            hour = hour - 12;
          }

          actdt.setHours(hour,min);
          

          Meteor.call("addTimerAction", qollMasterId, actdt, 'lock');
          qlog.info("Selected start or end date: " + $("#qollenddate").val() + $("#qollsenddate").val(), filename);
          
        }
        target.html("Qoll Saved...");
        jQuery(".qollstionnaire-title").val('');
        $('.qoll_selection').prop("checked", false);
        $('.qoll_selectall').prop("checked", false);
    
        jQuery("input#recipient_search").val('');
        target.fadeOut(2400, function() {
          //setTimeout(function(){
          target.html(store_html);
          target.removeAttr("style");
          //}, 800);
          qlog.info('Adding store-qoll button back: ' + store_html, filename);
        });
        QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Stored questionaire ...');
        return qollMasterId;
      }
    });

  },
  'click button.send' : function() {
    qlog.info('Clicked on send. Will be sending/storing the questonnaire at this point. ' , filename);

    var allqollids = [];
    $('.qoll').each(function() {
      var qoll = $(this);
      qlog.info('Will be storing qoll with id: ' + qoll.id + '/' + this.id, filename);
      allqollids.push(this.id);
    });

    var recips = jQuery("input#recipient_search").val();
    var title = jQuery("input.qollstionnaire-title").val();
    var tags = jQuery("input#add-tags").val();

    //recipients is a required field
    if ($.trim(recips) === '' || $.trim(title) === '' || allqollids.length == 0) {
      QollError.message(QollConstants.MSG_TYPE.ERROR, 'Select questions, add recipients and title to create qollstionnaire ...');
      return;
    }

    var tagArr=[];
    $.each(tags.split(/;|,|\s/),function (ix,tag){
      tag=$.trim(tag);
      if(tag.length>0){
        tagArr.push(tag);
      }
    });

    qlog.info('tags are - ' + tagArr, filename);
    var target = jQuery(".qbank-error-msg");
    var store_html = target.html();
    target.html("<i class='fa fa-spinner fa-spin toolbar-buttons-link'></i>Saving...");


    var emailsandgroups = [];
    $.each(recips.split(/;|,/), function(ix, email) {
      email = $.trim(email);
      if (email.length > 0) {
        emailsandgroups.push(email);
      }
    });

    qlog.info('Printing other info from page - ' + recips + '/' + title + '/' + tags + '/' + emailsandgroups, filename);

    var qollstionnaire = {};
    qollstionnaire.emails = emailsandgroups;
    qollstionnaire.title = title.trim();
    qollstionnaire.tags = tagArr;
    qollstionnaire.status = QollConstants.STATUS.SENT;

    qollstionnaire.qollids = allqollids;

    qlog.info('Will be sending the questionaire - ' + JSON.stringify(qollstionnaire), filename);

    Meteor.call("addQollstionnaire", emailsandgroups, title.trim(), tagArr, QollConstants.STATUS.SENT, allqollids, function(err, qollstionnaire_id) {
      var target = jQuery(".qbank-error-msg");
      if (err) {
        qlog.info('Error occured storing the master qoll. Please try again.' + err, filename);
        target.html("Failed, try again...");
        target.fadeOut(1600, function() {
          //target.html(store_html);
        });
        return -1;
      } else {
        qlog.info("Added qoll-master-content with id: " + qollstionnaire_id, filename);
        //Wipe out the values inserted in the slide-up editor now
        jQuery("input#recipient_search").val('');
        jQuery("input.qollstionnaire-title").val('');
        jQuery("input#add-tags").val('');
        jQuery("span#cnt").html('0');
        $('span.qoll-container').remove();

        if ($("#qollsenddate").val() != '') {
          var actdt = new Date($("#qollsenddate").val());
          var hour = parseInt($('.qstion_send_hour').val());
          var min = parseInt($('.qstion_send_min').val());
          if ($('.qstion_send_ampm').val() == 'PM' && hour<12) {
            hour = hour + 12;
          }
          if ($('.qstion_send_ampm').val() == 'AM' && hour==12) {
            hour = hour - 12;
          }

          actdt.setHours(hour,min);
          

          Meteor.call("addTimerAction", qollstionnaire_id, actdt, 'send');
          qlog.info("Selected start or end date: " + $("#qollenddate").val() + $("#qollsenddate").val(), filename);

        }
        if ($("#qollenddate").val() != '') {
          var actdt = new Date($("#qollenddate").val());
          var hour = parseInt($('.qstion_end_hour').val());
          var min = parseInt($('.qstion_end_min').val());
          if ($('.qstion_end_ampm').val() == 'PM' && hour<12) {
            hour = hour + 12;
          }
          if ($('.qstion_end_ampm').val() == 'AM' && hour==12) {
            hour = hour - 12;
          }

          actdt.setHours(hour,min);
          

          Meteor.call("addTimerAction", qollstionnaire_id, actdt, 'lock');
          qlog.info("Selected start or end date: " + $("#qollenddate").val() + $("#qollsenddate").val(), filename);
          
        }
        target.html("Qoll Saved...");
        jQuery(".qollstionnaire-title").val('');
        $('.qoll_selection').prop("checked", false);
        $('.qoll_selectall').prop("checked", false);
    
        jQuery("input#recipient_search").val('');
        target.fadeOut(2400, function() {
          //setTimeout(function(){
          target.html(store_html);
          target.removeAttr("style");
          //}, 800);
          qlog.info('Adding store-qoll button back: ' + store_html, filename);
        });
        QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Stored questionaire ...');

        // Send questionnaire email now
        qlog.info('Sending questionnaire to recepients now - ' + emailsandgroups + '/' + qollstionnaire_id);
        Meteor.call('sendQollstionnaireMail', qollstionnaire_id, function(err, data) {
          if (err) {
            qlog.info('Failed sending the email - ' + qollstionnaire_id + '/' + err, filename);
          } else {
            qlog.info('Sent the email - ' + qollstionnaire_id + ', message - ' + data, filename);
          }
        });

        return qollstionnaire_id;
      }
    });

  },
  'click .remove-qoll' : function(event) {
    var qollId = event.currentTarget.id;
    var target = $("span[id='"+qollId+"_outer']");
    qlog.info('removing this qoll - ' + qollId, filename);
    $("input[id='"+qollId+"']").prop('checked', false);;
    target.remove();

    //Set the appropriate count in the header here
    var cnt = Number($("span[id='cnt']").html());
    cnt--;
    $("span[id='cnt']").html(cnt);
  },
  /**'click .facebook' : function() {
    //TODO
    qlog.info('Will be posting to facebook on this click ...', filename);
  },
  'click .sendemail' : function() {
    //TODO
    qlog.info('Will be sending to email on this click ...', filename);
  }, **/

 });

// perform all the core operations here and move the custom to store and send blocks in the AutoForm hook
var createQuestionnaire = function(jsn) {
    qlog.info(jsn.action + ' the questionnaire ...' , filename);

    var allqollids = jsn.allqollids;

    var emailsandgroups = jsn.recips;
    var title = jsn.title;
    var tagArr = jsn.tags;

    var qollstionnaire = {};
    qollstionnaire.emails = jsn.recips;
    qollstionnaire.title = jsn.title.trim();
    qollstionnaire.tags = jsn.tags;
    qollstionnaire.topics = jsn.topics;
    qollstionnaire.status = jsn.action;

    qollstionnaire.qollids = allqollids;

    qollstionnaire.end_time = jsn.end_time;

    Meteor.call("addQollstionnaire", emailsandgroups, title.trim(), tagArr, qollstionnaire.topics, jsn.action, allqollids, undefined, jsn.end_time, jsn.qoll_attributes, function(err, qollstionnaire_id) {
      var target = jQuery(".qbank-error-msg");
      if (err) {
        qlog.info('Error occured storing the master qoll. Please try again.' + err, filename);
        target.html("Failed, try again...");
        target.fadeOut(1600, function() {
          //target.html(store_html);
        });
        return -1;
      } else {
        qlog.info("Added qoll-master-content with id: " + qollstionnaire_id, filename);
        //Wipe out the values inserted in the slide-up editor now
        jQuery("input.qollstionnaire-title").val('');
        jQuery("span#cnt").html('0');
        $('span.qoll-container').remove();

        
        target.html("Qoll Saved...");
        jQuery(".qollstionnaire-title").val('');
        $('.qoll_selection').prop("checked", false);
        $('.qoll_selectall').prop("checked", false);
    
        target.fadeOut(2400, function() {
          target.html(store_html);
          target.removeAttr("style");
          qlog.info('Adding store-qoll button back: ' + store_html, filename);
        });

        if('send' === jsn.action) {
          // Send questionnaire email now
          qlog.info('Sending questionnaire to recepients now - ' + emailsandgroups + '/' + qollstionnaire_id);
          Meteor.call('sendQollstionnaireMail', qollstionnaire_id, function(err, data) {
            if (err) {
              qlog.info('Failed sending the email - ' + qollstionnaire_id + '/' + err, filename);
            } else {
              qlog.info('Sent the email - ' + qollstionnaire_id + ', message - ' + data, filename);
            }
          });

          QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Sent questionaire ...');
        } else {
          QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Stored questionaire ...');
        }

        return qollstionnaire_id;
      }
    });

  };



renderTags = function(x) {
    // qlog.info('called render qoll to emails method', filename);
    //console.log(x);
    return Blaze.toHTMLWithData(Template.tags_autocomplete, x);
    // return x.email + x.name;
};

renderTopics = function(x) {
    // qlog.info('called render qoll to emails method', filename);
    //console.log(x);
    return Blaze.toHTMLWithData(Template.topics_autocomplete, x);
    // return x.email + x.name;
};

