var filename='client/views/q/chemwiki/chemwiki_homework.js';

Template.chemwiki_homework.helpers({
	submitted_on : function(qollstionnaireSubmittedOn) {
		// console.log(qollstionnaireSubmittedOn);

		if(!qollstionnaireSubmittedOn) return '';
		else {
			// return qollstionnaireSubmittedOn;
			return moment(qollstionnaireSubmittedOn).format('MMM Do YYYY, h:mm a');
		}
	},
	created_on : function(qollstionnaireCreatedOn) {
		// console.log(qollstionnaireCreatedOn);

		if(!qollstionnaireCreatedOn) return '';
		else {
			// return qollstionnaireSubmittedOn;
			return moment(qollstionnaireCreatedOn).format('MMM Do YYYY, h:mm a');
		}
	},
	ending_on : function(qollstionnaireEndingOn) {
		// console.log(qollstionnaireCreatedOn);

		if(!qollstionnaireEndingOn) return '';
		else {

			var dt_now = new Date();
			if(dt_now > qollstionnaireEndingOn){
				return "<u>Closed:</u> "+moment(qollstionnaireEndingOn).format('MMM Do YYYY, h:mm a');
			} else {
				return "<u>Deadline:</u> "+moment(qollstionnaireEndingOn).format('MMM Do YYYY, h:mm a');
			}
		}
	},
	facebook_qoll : function(length_class) {
		if(length_class === 'facebook-qoll')
			return true;
	},
});


Template.chemwiki_homework.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	}
});