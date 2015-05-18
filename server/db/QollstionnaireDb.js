var filename='server/db/Qollstionnaire.js';

/** New Set of methods tomanage qolls from new qoll-editor **/
Meteor.methods({
	addQollstionnaire : function(emailsandgroups, title, tags, status, qollids, user_id) {
		qlog.info('Storing the questionaire - ' + JSON.stringify(qollstionnaire), filename);
		var qollstionnaire = {};


		qlog.info('============================> printing user-id from mobile app ' + user_id, filename);


		if(user_id) {
			// request coming from the mobile app, set this user-id
			qollstionnaire.submittedBy = user_id;
		}

		var eandg = QollParser.parseEmailAndGroups(emailsandgroups);
		qollstionnaire.submittedTo = eandg.submittedTo;
		qollstionnaire.submittedToGroup = eandg.submittedToGroup;
		qollstionnaire.submittedToGroup.map(function(grp){
			var qg = QollGroups.findOne({'groupName' : grp, 'createdBy' : Meteor.userId()});
			if(qg && qg.userEmails && qg.userEmails.length > 0) {
				qg.userEmails.map(function(eml){
					if(_.indexOf(eml) == -1) 
						qollstionnaire.submittedTo.push(eml);
				});
			}
		});

		qollstionnaire.title = title;
		qollstionnaire.tags = tags;
		qollstionnaire.status = status;
		qollstionnaire.qollids = qollids;


		var qbankids = qollstionnaire.qollids;
		var emails = qollstionnaire.submittedTo;

		var qolls_to_email = {};
		emails.forEach(function(email){
			email = CoreUtils.encodeEmail(email); //email.replace(/\./g,"&#46;");
			qlog.info('Printing email =======> ' + email, filename);
			qolls_to_email[email] = {};
			qbankids.forEach(function(qid){
				qolls_to_email[email][qid] = '';
			});
		});

		qollstionnaire.qolls_to_email = qolls_to_email;

		// add uuid to the questionnaire
		qollstionnaire.quuid = CoreUtils.generateUUID();

		// add uuid for each user to cross check when the hit the link from the email
		qollstionnaire.submittedToUUID = {};
		qollstionnaire.submittedTo.forEach(function(el){
			el = CoreUtils.encodeEmail(el); // el.replace(/\./g,"&#46;");
			qollstionnaire.submittedToUUID[el] = CoreUtils.generateUUID();
		});

		qlog.info('Printing qollstionnaire - ' + JSON.stringify(qollstionnaire), filename);

		var qollstionnaire_id = Qolls.QollstionnaireDb.insert(qollstionnaire);

		if(qollstionnaire_id && qollstionnaire.tags) {
			var err_msg = QollTagsDb.storeTags(qollstionnaire.tags);
			qlog.info('Printing tags return results - ' + err_msg, filename);
		}

		return qollstionnaire_id;
	}
});