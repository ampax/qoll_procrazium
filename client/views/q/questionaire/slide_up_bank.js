var filename='client/views/questionaire/slide_up_bank.js';
/*
 * JQuery functions for slideout feedback form
 * 
 * Sets up a sliding form on click of a feedback button
 * On submit button will send the data to a php script
 *
 */
 Template.slide_up_bank.events({

  'click div.slider' : function() {
    qlog.info('Clicked on the slider div');
    $( "div.slider" ).slideToggle();
  },
  'click span.toggle' : function() {
    qlog.info('Clicked on the span toggle.');
    $( "div.form-static" ).slideToggle();
    $( "div.form-scroll" ).slideToggle();
    $( "div.form-scroll-info" ).slideToggle();
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
      Error.message(QollConstants.MSG_TYPE.ERROR, 'Select questions, add recipients and title to create qollstionnaire ...');
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
        Error.message(QollConstants.MSG_TYPE.SUCCESS, 'Stored questionaire ...');
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

    qlog.info('Printing other info from page - ' + recips + '/' + title + '/' + tags, filename);

    //recipients is a required field
    if ($.trim(recips) === '' || $.trim(title) === '' || allqollids.length == 0) {
      Error.message(QollConstants.MSG_TYPE.ERROR, 'Select questions, add recipients and title to create qollstionnaire ...');
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
    qollstionnaire.status = QollConstants.STATUS.SENT;

    qollstionnaire.qollids = allqollids;

    qlog.info('Will be storing the questionaire - ' + JSON.stringify(qollstionnaire), filename);

    Meteor.call("addQollstionnaire", emailsandgroups, title.trim(), tagArr, QollConstants.STATUS.SENT, allqollids, function(err, qollMasterId) {
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
        Error.message(QollConstants.MSG_TYPE.SUCCESS, 'Stored questionaire ...');
        return qollMasterId;
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

 });

