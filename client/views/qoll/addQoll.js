var filename="client/views/qoll/addQoll.js";

var StdQollTypes = new Meteor.Collection("standard-qoll-types");
var CstQollTypes = new Meteor.Collection("custom-qoll-types");

Template.addQoll.helpers({
    allQollTypes: function(event){
        qlog.info('Getting the qoll-types standard + custom');
        var std = StdQollTypes.find().fetch();
        var cst = CstQollTypes.find().fetch();
        //qlog.info('standard qtypes: ' + JSON.stringify(std), filename);
        var qtypes = _.union(std, cst);// std.concat(cst).unique();
        return qtypes;
    },
});

Template.addQoll.events({
    'click .send-qoll': function(event){
        processQoll('send', event);
    },
    'click .store-qoll': function(event){
        processQoll('store', event);
    },





    'click .add-qoll1': function(event){
        event.preventDefault();
        var qoll = $("#qollText").val();
        var qollType = $("#qollType").val();
        qlog.info("Printing qollType: " + qollType);

        if(qollType == "-1") {
        	//set this to default yes/no
        	var def = StdQollTypes.find({'qollType' : 'yes,no'}).fetch();
        	qollType = def._id;
        }

        Meteor.call("addQoll", qoll, qollType, function(error, qollId){
            qlog.info("Added qoll with id: " + qollId, filename);
        });

        qlog.info("Added qoll: " + qoll, filename);                                                                                                                           
        $("#qollText").val("");
    },
    'click .qoll-type': function(event){
    	event.preventDefault();
    	qlog.info('Selected qoll-type: ' + $('#qoll-type').val());
    }
});



/** jQuery functionality will come here **/
Template.addQoll.rendered = function() {
    qlog.info('clicked on addQoll', filename);
    jQuery('.add-option').click(function(){
        var option = $("#qolltypeoption").val();
        qlog.info("Adding new option: "+option, filename);

        jQuery('#qolloptions').append("<div class='qoll-panel' id='qolltype-panel'>"+option+"</div>");
        $("#qolltypeoption").val('');
    });

    jQuery('.send-to').click(function(){
        var email = $("#qollsendto").val();
        qlog.info("Adding new email: "+email, filename);

        jQuery('#sendtoemails').append("<div class='qoll-panel' id='email-panel'>"+email+"</div>");
        $("#qollsendto").val('');
    });
}

var processQoll = function(act, event) {
    var qollText = $("#qollText").val();
    qlog.info('Submitting the qols here==>> qollText: ' + qollText, filename);
    var qollTypes = new Array();
    $('#qolltype-panel').each(function(){
        qlog.info('found option: ' + $(this).html());
        qollTypes.push($(this).html());
    });

    var emails = new Array();
    $('#email-panel').each(function(){
        qlog.info('found email: ' + $(this).html());
        emails.push($(this).html());
    });

    //$("#qolltitle").val('');
    $("#qollText").val('');
    $('#qolltype-panel').html('');
    $('#email-panel').html('');
    if(qollText) {
        qlog.info('to send to database: ' + qollText + ', ' + qollTypes + ', ' + emails, filename);
        Meteor.call("addQoll", act, qollText, qollTypes, emails, function(error, qollId){
            qlog.info("Added qoll with id: " + qollId, filename);
        });
    }
}
