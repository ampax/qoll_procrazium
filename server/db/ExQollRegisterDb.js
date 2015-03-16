var filename = 'lib/db/ExtQollRegisterDb.js';

Meteor.methods({
	ExQoll_AddQollstionnaireResponse : function(qsnrid, qollId, qollTypeVal, qollTypeIx, qollPortal, extUserEmailId) {
		if(qollPortal === undefined) return; // Do not insert from ExtQollRegisterDb.js if this is from Ext sources
		if(extUserEmailId === undefined) return; // Return if there is no email id attached to the questionaire response

		qlog.info('Received register request from ext client - ' + qsnrid + '/' +  qollPortal + '/' + extUserEmailId, filename);
		
		// Check if a user already exists with the provided email-id, if yes, then user user-id also to register response
		// Else store with the user-email-id
		var user=Meteor.users.findOne({ "profile.email" : extUserEmailId });
	    if(!user) {
	        user=Meteor.users.findOne({ "emails.address" : extUserEmailId });
	    }

	    if(user) qlog.info('Fetched user with email - ' + extUserEmailId + ' ::: ' + JSON.stringify(user), filename);

	    // The questionnaire answers will be registered using the email-id or the social-connect-id
		// User id for these users will not be available

		var thisemail = extUserEmailId;
		var usrid = user? user._id : undefined;

		//return;

		// find questionnaire
		var qsnr = Qollstionnaire.findOne({
			_id : qsnrid
		});
		if (!qsnr)
			return;
		qlog.info(" Adding qollstionnaire response for  " + qsnrid);

		var resp = 
			usrid ? QollstionnaireResponses.findOne({
				qollstionnaireid : qsnrid,
				usrid : usrid
			}) : QollstionnaireResponses.findOne({
				qollstionnaireid : qsnrid,
				ext_id : extUserEmailId
			});
		var qoll = Qoll.findOne({
			_id : qollId
		});
		var type;type = qoll.cat;
		//?"Multiple":"Single"; //TODO: add fill in blanks

		var iscorrect = false;
		iscorrect = false;
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
			var newentry;
			newentry = {
				qollstionnaireid : qsnrid,
				usrid : usrid,
				ext_id : thisemail,
				qollPortal : qollPortal,
				responses : {}
			};
			newentry.responses['' + qollId + ''] = {
				submittedOn : new Date(),
				response : resp_array,
				type : type,
				iscorrect : iscorrect
			};
			return QollstionnaireResponses.insert(newentry);
		} else {
			var value_to_set;
			if (resp.responses['' + qollId]) {//this qoll id exists
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
				return QollstionnaireResponses.update({
					_id : resp._id
				}, {
					$set : updatepaths
				});

			} else {//this qollid doesnt exist

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
				newresponse = {
					submittedOn : new Date(),
					response : resp_array,
					type : type,
					iscorrect : iscorrect
				};
				var updatepaths;
				updatepaths = {};
				updatepaths['responses.' + qollId] = newresponse;
				return QollstionnaireResponses.update({
					_id : resp._id
				}, {
					$set : updatepaths
				});

			}
		}
	},
	ExQoll_registerQollBlankResponse : function(qsnrid, qollId, fib, unit_selected, qollPortal, extUserEmailId) {
		if(qollPortal === undefined) qollPortal = QollConstants.QOLL_PORTAL.QOLL;
		if(extUserEmailId === undefined) return; // can not continue if no email-id

		// Check if a user already exists with the provided email-id, if yes, then user user-id also to register response
		// Else store with the user-email-id
		var user=Meteor.users.findOne({ "profile.email" : extUserEmailId });
	    if(!user) {
	        user=Meteor.users.findOne({ "emails.address" : extUserEmailId });
	    }

	    if(user) qlog.info('Fetched user with email - ' + extUserEmailId + ' ::: ' + JSON.stringify(user), filename);

	    qlog.info('--------- >>>>>> Received register request from ext client - ' + qsnrid + '/' +  qollPortal + '/' + extUserEmailId, filename);

	    // The questionnaire answers will be registered using the email-id or the social-connect-id
		// User id for these users will not be available

		var thisemail = extUserEmailId;
		var usrid = user? user._id : undefined;

		// find questionnaire
		var qsnr = Qollstionnaire.findOne({ _id : qsnrid});

		if (!qsnr)
			return;

		qlog.info(" Adding qollstionnaire response for  " + qsnrid);

		var qoll = Qoll.findOne({ _id : qollId });
		var type;type = qoll.cat;

		var iscorrect = [];
		var cnt = 0;
		qoll.fib.map(function(f){
			if(f === fib[cnt]) iscorrect.push(true);
			else iscorrect.push(false);
		});

		var resp = 
			usrid ? QollstionnaireResponses.findOne({
				qollstionnaireid : qsnrid,
				usrid : usrid
			}) : QollstionnaireResponses.findOne({
				qollstionnaireid : qsnrid,
				ext_id : extUserEmailId
			});

		if (!resp) {
			//create a new response
			var newentry;
			newentry = {
				qollstionnaireid : qsnrid,
				usrid : usrid,
				ext_id : thisemail,
				qollPortal : qollPortal,
				responses : {}
			};
			newentry.responses['' + qoll._id + ''] = {
				submittedOn : new Date(),
				response : fib,
				type : QollConstants.QOLL_TYPE.BLANK,
				iscorrect : iscorrect,
				unit 	: unit_selected
			};

			return QollstionnaireResponses.insert(newentry);
		} else {
			if (resp.responses['' + qollId]) {//this qoll id exists

				var updatepaths;
				updatepaths = {};
				updatepaths['responses.' + qollId + '.response'] = fib;
				updatepaths['responses.' + qollId + '.submittedOn'] = new Date();
				updatepaths['responses.' + qollId + '.iscorrect'] = iscorrect;
				updatepaths['responses.' + qollId + '.unit'] = unit_selected;
				return QollstionnaireResponses.update({ _id : resp._id }, { $set : updatepaths });

			} else {//this qollid doesnt exist
				var newresponse;
				newresponse = {};
				newresponse = {
					submittedOn : new Date(),
					response : fib,
					type : QollConstants.QOLL_TYPE.BLANK,
					iscorrect : iscorrect,
					unit 	: unit_selected
				};
				var updatepaths;
				updatepaths = {};
				updatepaths['responses.' + qollId] = newresponse;
				return QollstionnaireResponses.update({ _id : resp._id }, { $set : updatepaths });

			}
		}

	},
	ExQoll_registerHint : function(qollId, qsnrid, qollPortal, extUserEmailId) {
		if(qollPortal === undefined) qollPortal = QollConstants.QOLL_PORTAL.QOLL;
		if(extUserEmailId === undefined) return; // can not continue if no email-id

		// Check if a user already exists with the provided email-id, if yes, then user user-id also to register response
		// Else store with the user-email-id
		var user=Meteor.users.findOne({ "profile.email" : extUserEmailId });
	    if(!user) {
	        user=Meteor.users.findOne({ "emails.address" : extUserEmailId });
	    }

	    if(user) qlog.info('Fetched user with email - ' + extUserEmailId + ' ::: ' + JSON.stringify(user), filename);

	    qlog.info('--------- >>>>>> Received register request from ext client - ' + qsnrid + '/' +  qollPortal + '/' + extUserEmailId, filename);

	    // The questionnaire answers will be registered using the email-id or the social-connect-id
		// User id for these users will not be available

		var thisemail = extUserEmailId;
		var usrid = user? user._id : undefined;
		
		// find questionnaire
		var qsnr = Qollstionnaire.findOne({ _id : qsnrid});

		if (!qsnr)
			return;

		qlog.info(" Adding qollstionnaire response for  " + qsnrid);

		var qoll = Qoll.findOne({ _id : qollId });
		var type;type = qoll.cat;

		var resp = 
			usrid ? QollstionnaireResponses.findOne({
				qollstionnaireid : qsnrid,
				usrid : usrid
			}) : QollstionnaireResponses.findOne({
				qollstionnaireid : qsnrid,
				ext_id : extUserEmailId
			});

		if (!resp) {
			createRespObject(qsnrid, usrid, type, qoll, undefined, true);
		} else {
			var updatepaths;
			updatepaths = {};
			if (resp.responses['' + qollId]) {
				//TODO
				updatepaths['responses.' + qollId + '.usedHint'] = true; //iscorrect
				return QollstionnaireResponses.update({
					_id : resp._id
				}, {
					$set : updatepaths
				});
			} else {
				//TODO
				var newresponse;
				newresponse = {};
				newresponse = {
					submittedOn : new Date(),
					response : [],
					type : type,
					iscorrect : undefined,
					usedHint : true

				};
				
				updatepaths['responses.' + qollId] = newresponse;
				return QollstionnaireResponses.update({
					_id : resp._id
				}, {
					$set : updatepaths
				});
			}
			//Update the questionnaire and set usedHint flag for qoll
		}
	},
});

var findQollRegisters = function(submittedBy, qollId) {
	var q = QollRegister.findOne({
		'submittedBy' : submittedBy,
		'qollId' : qollId
	});
	if (q != undefined) {
		return {
			'qollTypeVal' : q.qollTypeVal,
			'qollTypeReg' : q.qollTypeReg,
			'unitSelected' : q.unitSelected,
			'submittedOn' : q.submittedOn
		};
	} else {
		return CoreUtils.getUint8Array(0);
	}
};


//Initialize 
var createRespObject = function(qsnrid, usrid, type, qoll, qollTypeIx, usedHint) {
	var iscorrect = undefined;
	var resp_array;
	resp_array = new Array(qoll.qollTypes.length);
	if(qollTypeIx != undefined) resp_array[qollTypeIx] = true;
	if (type == QollConstants.QOLL.TYPE.SINGLE) {
		if(qollTypeIx!=undefined) {
			iscorrect = qoll.qollTypesX.reduce(function(previousValue, currentValue, index, array) {
				if (currentValue.index == qollTypeIx && currentValue.isCorrect)
					return true;
				return previousValue;
			}, false);
		}
	}
	//create a new response
	var newentry;
	newentry = {
		qollstionnaireid : qsnrid,
		usrid : usrid,
		responses : {}
	};
	newentry.responses['' + qoll._id + ''] = {
		submittedOn : new Date(),
		response : resp_array,
		type : type,
		iscorrect : iscorrect,
		usedHint : usedHint
	};
	return QollstionnaireResponses.insert(newentry);
};
