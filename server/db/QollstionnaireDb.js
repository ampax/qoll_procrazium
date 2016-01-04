var filename='server/db/Qollstionnaire.js';

QollstionnaireFns = {

	close_questionnaire : function(questionnaire_id, user_id) {
		qlog.info('Closing the questionnaire ' + questionnaire_id + ' for ' + user_id + ' now ...', filename);
		var resp_msg = {};
		Qolls.QollstionnaireDb.update({_id : questionnaire_id}, {qollstionnaireClosed : 'closed', qollstionnaireClosedOn : new Date(), closedBy : user_id});
		return {'msg' : 'Questionnaire Closed ...'};
	}

};

/** New Set of methods tomanage qolls from new qoll-editor **/
Meteor.methods({
	addQollstionnaire : function(emailsandgroups, title, tags, topics, status, qollids, user_id, end_time, qoll_attributes) {
		var qollstionnaire = {};


		qlog.info('============================> printing user-id from mobile app ' + user_id, filename);


		if(user_id) {
			// request coming from the mobile app, set this user-id
			qollstionnaire.submittedBy = user_id;
		}

		var eandg = QollParser.parseEmailAndGroups(emailsandgroups);
		qollstionnaire.submittedTo = eandg.submittedTo;
		qollstionnaire.submittedToGroup = eandg.submittedToGroup;

		qlog.info('==================+++++> ' + qollstionnaire.submittedTo, filename);

		eandg.submittedToGroup.forEach(function(grp){
			// Find all emailids in this group and push it in the submitted to
			var grpemails = QollGroups.find({'submittedBy': Meteor.userId(), 'groupName' : grp},
											{"_id": 1,'groupName':1, 'userEmails':1, 'submittedBy':2}).fetch();


			if(grpemails && grpemails.length > 0 && grpemails[0].userEmails)
				grpemails[0].userEmails.forEach(function(emls){
					qollstionnaire.submittedTo.push(emls);
				});
		});

		qlog.info('==================+++++> ' + qollstionnaire.submittedTo, filename);


		/** qollstionnaire.submittedToGroup.map(function(grp){
			var qg = QollGroups.findOne({'groupName' : grp, 'createdBy' : Meteor.userId()});
			if(qg && qg.userEmails && qg.userEmails.length > 0) {
				qg.userEmails.map(function(eml){
					if(_.indexOf(eml) == -1) 
						qollstionnaire.submittedTo.push(eml);
				});
			}
		}); **/

		topics = topics == undefined? ['Unassigned'] : topics;

		qollstionnaire.title = title;
		qollstionnaire.tags = tags;
		qollstionnaire.topics = topics;
		qollstionnaire.status = status;
		qollstionnaire.qollids = qollids;
		qollstionnaire.end_time = end_time;
		qollstionnaire.qoll_attributes = qoll_attributes;

		var total_weight = 0;
		_.values(qoll_attributes).forEach(function(e){
			total_weight = +total_weight + +e.weight;
		});

		qollstionnaire.total_weight = total_weight;

		if(qollstionnaire.qollids.length === 1)
			qollstionnaire.category = 'quicker';
		else
			qollstionnaire.category = 'questionnaire';


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

		// comments will be kept in the form {email-ids : comment, submitted-on : new Date(), some more : attributes}
		// pushed in an array in the order of creation
		qollstionnaire.qolls_to_comments = {};

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

		if(topics != undefined) {
			var err_msg = QollTopicsDb.storeTopics(topics);
			qlog.info('Printing topics return results - ' + err_msg, filename);
			var err_msg_1 = QollTopicsFavsDb.storeFavorites(topics, 1, 'create', 'qollstionnaire');
		}

		return qollstionnaire_id;
	},

	addAnonymousQollstionnaire : function(title, qollids, anonymous_type) {/** facebook, google, twitter, anonymous**/
		// create an anonymous questionnaire here, register the responses for some id
		var qollstionnaire = {};
		var tags = new Array();

		var qolls = Qolls.QollDb.getAll( { _id : { $in : qollids }} );

		qolls.map(function(q){
			if(q.tags) tags = tags.concat(q.tags);
		});


		qlog.info('ANONYMOUS ============================> printing user-id from mobile app ' + Meteor.userId(), filename);


		//if(user_id) {
			// request coming from the mobile app, set this user-id
			qollstionnaire.submittedBy = Meteor.userId();
		//}

		qollstionnaire.title = title;
		qollstionnaire.tags = tags;
		qollstionnaire.status = QollConstants.STATUS.SENT;
		qollstionnaire.qollids = qollids;

		qollstionnaire.category = 'anonymous';

		qollstionnaire.qolls_to_comments = {};

		// add uuid to the questionnaire
		qollstionnaire.quuid = CoreUtils.generateUUID();

		qollstionnaire.anonymous_type = anonymous_type;

		qollstionnaire.submittedTo = [];
		qollstionnaire.submittedToUUID = {};
		qollstionnaire.submittedToGroup = [];
		qollstionnaire.qolls_to_email = {};

		var qollstionnaire_id = Qolls.QollstionnaireDb.insert(qollstionnaire);

		return qollstionnaire_id;
	},

	submit_questionnaire : function(questionnaire_id, user_id) {
		var resp_msg = {};

		var resp = QollstionnaireResponses.findOne({
			qollstionnaireid : questionnaire_id,
			usrid : user_id
		});

		if(resp) {
			QollstionnaireResponses.update({qollstionnaireid : questionnaire_id, usrid : user_id}, 
				{$set : {qollstionnaireSubmitted : true, qollstionnaireSubmittedOn : new Date()}});

			resp_msg.msg = 'Submitted the questionnaire.';
		} else {
			resp_msg.msg = 'Register responses before submitting please.';
		}

		return resp_msg;
	},

	close_questionnaire : function(questionnaire_id, user_id) {
		return QollstionnaireFns.close_questionnaire(questionnaire_id, user_id);
	},

	resend_submitted_questionnaire : function(questionnaire_id, email_id) {
		// set submitted to false and submitted-on to undefined
		var u1 = Meteor.users.find({'emails.address' : email_id}).fetch();


		if(u1.length > 0) { 
			QollstionnaireResponses.update({qollstionnaireid : questionnaire_id, usrid : u1[0]._id}, 
				{$set : {qollstionnaireSubmitted : false, qollstionnaireSubmittedOn : undefined}});
		} else {
			QollstionnaireResponses.update({qollstionnaireid : questionnaire_id, email : email_id}, 
				{$set : {qollstionnaireSubmitted : false, qollstionnaireSubmittedOn : undefined}});
		}
	},

	update_questionnaire_comment : function(questionnaire_id, qoll_id, email_id, comment) {
		var ufound = Meteor.users.find({ "_id" : this.userId }).fetch();
		if (ufound.length > 0) {
			// update comment for the user-id (finding-email-id using user-id)
			var user = ufound[0];
			var email_id = user.profile.email;

			// {email-ids : comment, submitted-on : new Date(), some more : attributes}

			var quest = Qollstionnaire.findOne({'_id' : questionnaire_id});
			var qolls_to_comments = quest.qolls_to_comments;

			var owner_comment = quest.submittedBy === user._id;
			// Qollstionnaire.find({'_id' : findoptions._id})
			qlog.info('qolls to comments =====> '+JSON.stringify(quest) + '/' + questionnaire_id + '/' + qoll_id, filename);
			qlog.info(qolls_to_comments, filename);

			
			if(qolls_to_comments == undefined) qolls_to_comments = {};

			var comments = qolls_to_comments[qoll_id] ? qolls_to_comments[qoll_id] : new Array();
			var comment_id = comments.length+1;

			var comment_obj = {comment_id : comment_id, email_id : email_id, user_id : user._id, comment : comment, 
								commentedOn : new Date(), owner_comment : owner_comment};

			comments.push(comment_obj);

			qolls_to_comments[qoll_id] = comments;

			qlog.info('---------------------->'+JSON.stringify(qolls_to_comments), filename);
			qlog.info('---------------------->'+JSON.stringify(comment_obj), filename);
			qlog.info('---------------------->'+JSON.stringify(comments), filename);

			Qolls.QollstionnaireDb.update({'_id' : questionnaire_id}, {'qolls_to_comments' : qolls_to_comments});
		} else if(email_id) {
			// ensure that the email-id is of the right person and then update the comment for email-id
		}
	}
});