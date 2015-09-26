var filename = 'server/db/FacebookRegisterDb.js';

Meteor.methods({
	FB_AddQollstionnaireResponse : function(qsnrid, qollId, qollTypeVal, qollTypeIx, qollPortal, extUserEmailId, sessionUUID){
		qlog.info('Received register request from ext client - uuid: ' + sessionUUID + '/' + qsnrid + '/' +  qollPortal + '/' + extUserEmailId, filename);
		// start registering the facebook response here
		if(qollPortal === undefined) return; // Do not insert from ExtQollRegisterDb.js if this is from Ext sources

		var user = undefined;
		var session_uuid = extUserEmailId;
		if(extUserEmailId === undefined || extUserEmailId =='') {
			// the user decided not to share the email-id, create a unique id and set that in the session for the user
			session_uuid = !sessionUUID? CoreUtils.generateUUID() : sessionUUID;
		} else {
			user=Meteor.users.findOne({ "profile.email" : extUserEmailId });
		    if(!user) {
		        user=Meteor.users.findOne({ "emails.address" : extUserEmailId });
		    }
		}

		qlog.info('uuid ======> ' + session_uuid, filename);

		// Check if a user already exists with the provided email-id, if yes, then user user-id also to register response
		// Else store with the user-email-id

	    if(user) qlog.info('Fetched user with email - ' + extUserEmailId + ' ::: ' + JSON.stringify(user), filename);

	    // The questionnaire answers will be registered using the email-id or the social-connect-id
		// User id for these users will not be available

		var thisemail = extUserEmailId;
		var usrid = user? user._id : session_uuid;

		// find questionnaire
		var qsnr = Qollstionnaire.findOne({ _id : qsnrid });

		if (!qsnr)
			return;
		qlog.info(" Adding qollstionnaire response for =========+_+_+_+_+_+_+======> " + qsnrid, filename);

		var iscorrect = false;
		iscorrect = false;

		var resp =  usrid ? QollstionnaireResponses.findOne({ qollstionnaireid : qsnrid, usrid : usrid })
						:QollstionnaireResponses.findOne({ qollstionnaireid : qsnrid, ext_id : extUserEmailId?extUserEmailId :session_uuid  });
		
		var qoll = Qoll.findOne({ _id : qollId });
		
		var type;
		type = qoll.cat;

		if (!resp) {
			var resp_array;
			resp_array = new Array(qoll.qollTypes.length);
			resp_array[qollTypeIx] = true;
			if (type == QollConstants.QOLL.TYPE.SINGLE) {
				iscorrect = qoll.qollTypesX.reduce(function(previousValue, currentValue, index, array) {
					if (currentValue.index == qollTypeIx && currentValue.isCorrect)
						return true;
					return previousValue;
				}, false);
			}
			//create a new response
			var newentry = { qollstionnaireid : qsnrid, usrid : usrid, ext_id : thisemail, qollPortal : qollPortal, responses : {} };

			newentry.responses['' + qollId + ''] = { submittedOn : new Date(), response : resp_array, type : type, iscorrect : iscorrect };
			QollstionnaireResponses.insert(newentry);
		} else {
			qlog.info('==================== updating the existing response ======================' + session_uuid + '/' + qollTypeIx, filename);

			var value_to_set;
			if (resp.responses['' + qollId]) {//this qoll id exists
				qlog.info('=====================> qoll id exists in the responses ' + qollTypeIx, filename);
				var new_responses;
				new_responses = resp.responses['' + qollId].response;

				if (type == QollConstants.QOLL.TYPE.SINGLE) {
						new_responses = new Array(qoll.qollTypes.length);
						new_responses[qollTypeIx] = true;
				} else {
					if ( typeof new_responses[qollTypeIx] == 'undefined') {
						new_responses[qollTypeIx] = true;
					} else {
						new_responses[qollTypeIx] = !new_responses[qollTypeIx];
					}
				}

				iscorrect = qoll.qollTypesX.reduce(function(previousValue, currentValue, index, array) {
					if ((currentValue.isCorrect && new_responses[currentValue.index]) || (!currentValue.isCorrect && !new_responses[currentValue.index]))
						return previousValue;
					return false;
				}, true);
				var updatepaths;
				updatepaths = {};
				updatepaths['responses.' + qollId + '.response'] = new_responses;
				updatepaths['responses.' + qollId + '.submittedOn'] = new Date();
				updatepaths['responses.' + qollId + '.iscorrect'] = iscorrect;
				QollstionnaireResponses.update({ _id : resp._id }, { $set : updatepaths });

			} else {//this qollid doesnt exist
				qlog.info('=====================> qoll id does not exist in the responses ' + qollTypeIx, filename);

				var resp_array;
				resp_array = new Array(qoll.qollTypes.length);
				resp_array[qollTypeIx] = true;

				if (type == QollConstants.QOLL.TYPE.SINGLE) {
					iscorrect = qoll.qollTypesX.reduce(function(previousValue, currentValue, index, array) {
						if (currentValue.index == qollTypeIx && currentValue.isCorrect)
							return true;
						return previousValue;
					}, false);
				}
				var newresponse;
				newresponse = {};
				newresponse = { submittedOn : new Date(), response : resp_array, type : type, iscorrect : iscorrect };
				var updatepaths;
				updatepaths = {};
				updatepaths['responses.' + qollId] = newresponse;
				QollstionnaireResponses.update({ _id : resp._id }, { $set : updatepaths });

			}
		}

		// return the session-id so that user's responses can be logged agains the same one to avoid duplication and maintain accuracy
		return session_uuid;
	},
});