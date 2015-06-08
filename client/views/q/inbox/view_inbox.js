var filename='client/views/q/inbox/view_inbox.js';

Template.view_inbox.helpers({
	submitted_on : function(qollstionnaireSubmittedOn) {
		console.log(qollstionnaireSubmittedOn);

		if(!qollstionnaireSubmittedOn) return '';
		else {
			// return qollstionnaireSubmittedOn;
			return moment(qollstionnaireSubmittedOn).format('MMM Do YYYY, h:mm a');
		}
	},
});