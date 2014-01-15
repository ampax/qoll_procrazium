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
    'click .add-qoll': function(event){
        var qollTitle = $("#qolltitle").val();
        var qollText = $("#qollText").val();
        qlog.info('Submitting the qols here==>> qollTitle: ' + qollTitle + ', qollText: ' + qollText, filename);
        var qollTypes = new Array();
        $('.qoll-type-panel').each(function(){
            qlog.info('found option: ' + $(this).html());
            qollTypes.push($(this).html());
        });

        $("#qolltitle").val('');
        $("#qollText").val('');
        $('.panel-body div').html('');
        if(qollTitle) {
            qlog.info('to send to database: ' + qollTitle + ', ' + qollText + ', ' + qollTypes, filename);
            Meteor.call("addQoll", qollTitle, qollText, qollTypes, function(error, qollId){
                qlog.info("Added qoll with id: " + qollId, filename);
            });
        }
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

        jQuery('.panel-body').append("<div class='qoll-type-panel'>"+option+"</div>");
        $("#qolltypeoption").val('');
        //alert('clicked');
        //jQuery(".editor-writer").addClass("is-invisible");
        //jQuery(".preview-qoll").addClass("is-invisible");
        //jQuery(".editor-preview").removeClass("is-invisible");
        //jQuery(".write-qoll").removeClass("is-invisible");
    });
}
