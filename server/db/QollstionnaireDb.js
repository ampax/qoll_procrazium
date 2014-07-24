var filename='server/db/Qollstionnaire.js';

/** New Set of methods tomanage qolls from new qoll-editor **/ /*
Meteor.methods({
	addQollstionnaire : function(qollstionnaire) {
		qollstionnaire.submittedBy = Meteor.userId();
		qollstionnaire.submittedOn = new Date();


		var qbankids = qollstionnaire.qollids;
		var emails = qollstionnaire.emails;

		var qolls_to_email = {};
		emails.forEach(function(email){
			email = email.replace(/\./g,"&#46;");
			qlog.info('Printing email =======> ' + email, filename);
			qolls_to_email[email] = {};
			qbankids.forEach(function(qid){
				qolls_to_email[email][qid] = '';
			});
		});

		qollstionnaire.qolls_to_email = qolls_to_email;

		qlog.info('Printing qollstionnaire - ' + JSON.stringify(qollstionnaire), filename);

		var qollstionnaire_id = Qollstionnaire.insert(qollstionnaire);

		if(qollstionnaire_id && qollstionnaire.tags) {
			var err_msg = QollTagsDb.storeTags(qollstionnaire.tags);
			qlog.info('Printing tags return results - ' + err_msg, filename);
		}

		return qollstionnaire_id;
	}
});*/