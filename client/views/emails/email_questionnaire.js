var filename='client/views/emails/email_questionnaire.js';

Template.email_questionnaire.helpers({
	questionaire : function() {
		return QuestionaireForId.findOne();
	},
	created_on : function(qollstionnaireCreatedOn) {
		// console.log(qollstionnaireCreatedOn);

		if(!qollstionnaireCreatedOn) return '';
		else {
			// return qollstionnaireSubmittedOn;
			return moment(qollstionnaireCreatedOn).format('MMM Do YYYY, h:mm a');
		}
	},
});