var filename="client/views/qoll/addQoll.js";

//var StdQollTypes = new Meteor.Collection("standard-qoll-types");
//var CstQollTypes = new Meteor.Collection("custom-qoll-types");
var QollGps = new Meteor.Collection("qoll-groups");

Template.addQoll.helpers({
    allQollTypes: function(event){
        qlog.info('Getting the qoll-types standard + custom');
        //var std = StdQollTypes.find().fetch();
        //var cst = CstQollTypes.find().fetch();
        //qlog.info('standard qtypes: ' + JSON.stringify(std), filename);
        //var qtypes = _.union(std, cst);// std.concat(cst).unique();
        return qtypes;
    },
     qollGroups: function(event){
        qlog.debug("Getting all the qoll gps ......", filename);                                                                                                                
        var q = QollGps.find({}, { reactive:true});
        qlog.info("Found qollGP: " + JSON.stringify(q.fetch()), filename);
        return q;
    }
});

Template.addQoll.events({
    'click .send-qoll': function(event){
        event.preventDefault();
        processQoll('send', event);
    },
    'click .store-qoll': function(event){
        event.preventDefault();
        processQoll('store', event);
    },
    'click .discard-qoll': function(event){
        qlog.info('Cancelling the changes', filename);
        event.preventDefault();
        $("div#update-section").addClass('is-invisible');
        $("div#insert-section").removeClass('is-invisible');
        $('.qoll-panel').remove();
        $("#qollText").val('');
        $("div#update_qoll_id").val('');
    },
});



/** jQuery functionality will come here **/
Template.addQoll.rendered = function() {
    qlog.info('Loaded addQoll', filename);
    //qoll-group-list
    jQuery('.add-option').click(function(){
        var option = $("#qolltypeoption").val();
        if(!option) {
            return;/** Qoll without qolls .. aaargh **/
        }
        qlog.info("Adding new option: "+option, filename);

        jQuery('#qolloptions').append("<div class='qollentry-panel qoll-panel' id='qolltype-panel'>"+option+"</div>");
        $("#qolltypeoption").val('');
    });
jQuery('.qoll-grp-select').click(function(){
	var selectedgp = $(this).text();
	selectedgp = $.trim(selectedgp);
	qlog.info("Selected Group: "+selectedgp, filename);
	if(!selectedgp) {
       return;/** wtf no group ... get out of here **/
    }
	jQuery('#sendtoemails').append($("<div class='email-panel qoll-panel' id='email-panel'>"+selectedgp+"</div>").append(
        			$("<i class='fa fa-times pull-right'></i>").click(function(){
        					qlog.info("clicked: "+$(this).parent().text(), filename);
							$(this).closest('div').remove();
        			})));
});
    jQuery('.send-to').click(function(){
        var emailin = $("#qollsendto").val();
        if(!emailin) {
            return;/** wtf no email ... get out of here **/
        }
         $.each(emailin.split(/;|,/),function (ix,email){
        	email=$.trim(email);
        	if(email.length>0){
        		qlog.info("Adding new email: "+email, filename);
        		jQuery('#sendtoemails').append($("<div class='email-panel qoll-panel' id='email-panel'>"+email+"</div>").append(
        			$("<i class='fa fa-times pull-right'></i>").click(function(){
        					qlog.info("clicked: "+$(this).parent().text(), filename);
							$(this).closest('div').remove();
        			})));
        	}
        });
        
        $("#qollsendto").val('');
    });

    $('body').removeClass('bg1');
};

processQoll = function(act, event) {
    var _id = $("div#update_qoll_id").val();
    if(_id) {
        qlog.info('Updating with id --------> ' + _id, filename);
    } else {
        qlog.info('Will insert a new qoll', filename);
    }

    var qollText = $("#qollText").val();
    qlog.info('Submitting the qols here==>> qollText: ' + qollText, filename);
    var qollTypes = new Array();
    $('.qollentry-panel').each(function(){
        qlog.info('found option: ' + $(this).html());
        qollTypes.push($(this).html());
    });

    var emails = new Array();
    $('.email-panel').each(function(){
        qlog.info('found email: ' + $(this).text());
        emails.push($(this).text());
    });

    if(!preCheckFailed(qollText, qollTypes)) {
        qlog.info('to send to database: ' + qollText + ', ' + qollTypes + ', ' + emails, filename);
        if(!_id) {
            Meteor.call("addQoll", act, qollText, qollTypes, emails, function(error, qollId){
                qlog.info("Added qoll with id: " + qollId, filename);
            });
        } else {
            //send an update here
            Meteor.call("updateQoll", qollText, qollTypes, emails, _id, function(error, qollId){
                qlog.info("Added qoll with id: " + qollId, filename);
            });
            $("div#update-section").addClass('is-invisible');
            $("div#insert-section").removeClass('is-invisible');
        }
        $('.qoll-panel').remove();
        $("#qollText").val('');
        $("div#update_qoll_id").val('');
    } else {
        qlog.info('Pre check failed, returning', filename);
        return;
    }
    
    
};

preCheckFailed = function(qollText, qollTypes) {
    if(!qollText || qollTypes.length == 0) return true;
    return false;
};
