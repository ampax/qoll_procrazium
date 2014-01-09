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