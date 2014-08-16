var filename="client/views/qoll/open_qolls.js";

var OpenQolls = new Meteor.Collection("all-open-qolls");

Template.open_qolls.events({
	//Add events for open-qolls page
	'click .edit-qoll' : function(event) {
		event.preventDefault();
		var qollId = this._id;
		var qollText = this.qollText;
		var qollTypes = this.qollTypes;
		var submittedTo = this.submittedTo;
		qlog.info('Editting the qoll with _id: ' + qollId + ', with text: ' + qollText + ', qollTypes: ' + qollTypes + ', submittedTo: ' + submittedTo, filename);
		/** Clear the inputs first **/
		$('.qoll-panel').remove();
        $("#qollText").val('');
		

		/** Set the values now **/
		$("div#update_qoll_id").val(qollId);
		$("#qollText").val(qollText);

		if(qollTypes && qollTypes.length > 0) {
			qollTypes.map(function(option){
				qlog.info('To add qoll-type: ' + option, filename);
				jQuery('#qolloptions').append("<div class='qollentry-panel qoll-panel' id='qolltype-panel'>"+option+"</div>");
			});
		}

		if(submittedTo && submittedTo.length > 0) {
			submittedTo.map(function(email){
				qlog.info('To add email: ' + email, filename);
				jQuery('#sendtoemails').append("<div class='email-panel qoll-panel' id='email-panel'>"+email+"</div>");
			});
		}

		$("div#insert-section").addClass('is-invisible');
		$("div#update-section").removeClass('is-invisible');
	}
});

Template.open_qolls.helpers({
	'openQolls' : function(event){
		qlog.info('Getting all the open qolls ...', filename);
		var q = OpenQolls.find({}, {sort:{'submittedOn':-1}, reactive:true});
        qlog.info("Found qoll: " + JSON.stringify(q.fetch()), filename);
        return q;
	},
});