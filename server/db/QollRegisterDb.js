var filename = 'lib/db/QollRegisterDb.js';

Meteor.methods({
	registerQoll : function(qollId, qollTypeVal) {
		qlog.info('In register qoll: ' + qollId + ', ' + qollTypeVal + ', Meteor.userId ' + Meteor.userId(), filename);
		var existQollReg = QollRegister.find({
			qollId : qollId,
			submittedBy : userId
		}).fetch();
		qlog.debug(existQollReg, filename);

		var qollRegId = QollRegister.insert({
			'qollId' : qollId,
			'qollTypeVal' : qollTypeVal,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId()
		});

		ReactiveDataSource.refresh('qollstat' + qollId);
		return qollRegId;
	},
	registerQollCustom : function(qollId, qollTypeVal, qollTypeIx) {
		var userId = Meteor.userId();
		qlog.info('In register custom qoll: ' + qollId + ', ' + qollTypeVal + ', Meteor.userId ' + Meteor.userId(), filename);
		var existQollReg = QollRegister.find({
			qollId : qollId,
			submittedBy : userId
		}).fetch();
		qlog.debug(existQollReg, filename);
		//step 1  verify publish access
		if (this.userId) {//first publish specialized qolls to this user
			//	qlog.info('MY  USERID --------->>>>>'+this.userId, filename);

			var ufound = Meteor.users.find({
				"_id" : this.userId
			}).fetch();
			if (ufound.length > 0) {
				var user = ufound[0];
				//step 1.1 verify qoll's group/user is valid for this user
				var qollFound = Qoll.find({'_id':qollId}).fetch()[0];
				var canans = false;
				qlog.info('checking ' + UserUtil.getEmail(user), filename);

				if (qollFound.submittedToGroup.length > 0) {
					var gpsraw = QollGroups.find({
						'userEmails' : UserUtil.getEmail(user),
						'submittedBy' : qollFound.submittedBy,
						'groupName' : {
							$in : qollFound.submittedToGroup
						}
					}, {
						fields : {
							"_id" : 0,
							'groupName' : 1,
							'submittedBy' : 2
						}
					}, {
						reactive : false
					});
					qlog.info('Custom one two three ' + UserUtil.getEmail(user) + ', ' + qollFound.submittedBy + ', ' + Meteor.userId(), filename);
					var allUserGroups = [];
					gpsraw.forEach(function(grpEntry) {
						canans = true;
					});
				}
				if (qollFound.submittedTo.indexOf(UserUtil.getEmail(user)) > -1) {
					canans = true;
					qlog.info('In register custom qoll: can publish ' + UserUtil.getEmail(user), filename);
				}
				if (canans) {
					//ansCount[qollFound.qollTypes.ind1exOf(qollTypeVal)]= ansCount[qollFound.qollTypes.indexOf(qollTypeVal)]?ansCount[qollFound.qollTypes.indexOf(qollTypeVal)]+1:1;
					var statsFilter = {};
					var qolltypkey = qollTypeIx;
					//qollTypeVal.replace(/\./g,"_");
					statsFilter["stats." + qolltypkey + ""] = 1;

					qlog.info('adding one to ' + "stats." + qolltypkey, filename);
					if (existQollReg.length > 0) {
						if ("stats." + qolltypkey != "stats." + existQollReg[0].qollTypeIndex) {

							statsFilter["stats." + existQollReg[0].qollTypeIndex] = -1;

							qlog.info('subt one to ' + "stats." + existQollReg[0].qollTypeIndex, filename);
						} else {
							statsFilter["stats." + qolltypkey] = 0;
							qlog.info('no change to ' + "stats." + qolltypkey, filename);
						}

						//reset the qollType for single choice, and modify/add it for multiple choice
						qlog.info('Setting registers for multiple qoll', filename);
						var qollTypeReg = undefined;
						if (qollFound.isMultiple == true) {
							qlog.info('xxxxxxxxxxxxxxxxxxxxxxxSetting registers for multiple qoll ' + qollFound.isMultiple + '/' + JSON.stringify(existQollReg[0]), filename);
							if (existQollReg.length > 0 && existQollReg[0].qollTypeReg != undefined && existQollReg[0].qollTypeReg != null) {
								qlog.info('AAAASetting registers for multiple qoll ' + qollFound.isMultiple, filename);
								qollTypeReg = existQollReg[0].qollTypeReg;
							} else {
								qlog.info('BBBBSetting registers for multiple qoll ' + qollFound.isMultiple, filename);
								qollTypeReg = CoreUtils.getUint8Array(QollConstants.MAX_SUPPORTED_QOLL_TYPES);
							}
							qollTypeReg[qollTypeIx] = qollTypeReg[qollTypeIx] === 1 ? 0 : 1;
						} else {
							qlog.info('yyyyyyyyyyyyyyyyyyyyyyyySetting registers for multiple qoll ' + qollFound.isMultiple, filename);
							qollTypeReg = CoreUtils.getUint8Array(QollConstants.MAX_SUPPORTED_QOLL_TYPES);
							qollTypeReg[qollTypeIx] = 1;
						}

						QollRegister.update({
							_id : existQollReg[0]._id
						}, {
							$set : {
								qollTypeVal : qollTypeVal,
								qollTypeIndex : qollTypeIx,
								qollTypeReg : qollTypeReg,
								'submittedOn' : new Date()
							}
						});
						Qoll.update({
							_id : qollId
						}, {
							$inc : statsFilter
						});
						//hopefully atomic so thread safe
						return existQollReg[0]._id;
					} else {

						qlog.info('zzzzzzzzzzzzzzzzzzzzzzzzSetting registers for multiple qoll', filename);

						qollTypeReg = CoreUtils.getUint8Array(QollConstants.MAX_SUPPORTED_QOLL_TYPES);
						qollTypeReg[qollTypeIx] = 1;

						var qollRegId = QollRegister.insert({
							'qollId' : qollId,
							'qollTypeVal' : qollTypeVal,
							'qollTypeIndex' : qollTypeIx,
							'qollTypeReg' : qollTypeReg,
							'submittedOn' : new Date(),
							'submittedBy' : Meteor.userId()
						});
						Qoll.update({
							_id : qollId
						}, {
							$inc : statsFilter
						});
						//hopefully atomic so thread safe
						return qollRegId;
					}

				}

			}
		}
		qlog.info('OUTOF register custom qoll: ' + qollRegId + ' canans: ' + canans, filename);
		return qollRegId;
	},
	AddQollstionnaireResponse : function(qsnrid, qollId, qollTypeVal, qollTypeIx) {
		var thisemail = UserUtil.getCurrentUserEmail();
		var usrid = this.userId;
		// find questionnaire
		var qsnr = Qollstionnaire.findOne({
			_id : qsnrid
		});
		if (!qsnr)
			return;
		qlog.info(" Adding qollstionnaire response for  " + qsnrid);

		var resp = QollstionnaireResponses.findOne({
			qollstionnaireid : qsnrid,
			usrid : this.userId
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
	registerHint : function(qollId, qsnrid) {
		//TODO: store the hint use with the 
		var thisemail = UserUtil.getCurrentUserEmail();
		var usrid = this.userId;
		// find questionnaire
		var qsnr = Qollstionnaire.findOne({ _id : qsnrid});

		if (!qsnr)
			return;

		qlog.info(" Adding qollstionnaire response for  " + qsnrid);

		var qoll = Qoll.findOne({ _id : qollId });
		var type;type = qoll.cat;

		var resp = QollstionnaireResponses.findOne({qollstionnaireid : qsnrid, usrid : this.userId});

		if (!resp) {
			createRespObject(qsnrid, usrid, type, qoll, undefined, true);
		} else {
			var updatepaths;
			updatepaths = {};
			if (resp.responses['' + qollId]) {
				//TODO
				updatepaths['responses.' + qollId + '.usedHint'] = iscorrect;
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
	findQollRegisters : function(submittedBy, qollId) {
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
	},
	registerQollBlankResponse : function(qsnrid, qollId, fib) {
		var userId = Meteor.userId();
		//TODO: populate the qollstionnaire table with fibs - new code
		var thisemail = UserUtil.getCurrentUserEmail();
		var usrid = this.userId;
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

		var resp = QollstionnaireResponses.findOne({qollstionnaireid : qsnrid, usrid : this.userId});

		if (!resp) {
			//create a new response
			var newentry;
			newentry = {
				qollstionnaireid : qsnrid,
				usrid : usrid,
				responses : {}
			};
			newentry.responses['' + qoll._id + ''] = {
				submittedOn : new Date(),
				response : fib,
				type : QollConstants.QOLL_TYPE.BLANK,
				iscorrect : iscorrect
			};

			return QollstionnaireResponses.insert(newentry);
		} else {
			if (resp.responses['' + qollId]) {//this qoll id exists

				var updatepaths;
				updatepaths = {};
				updatepaths['responses.' + qollId + '.response'] = fib;
				updatepaths['responses.' + qollId + '.submittedOn'] = new Date();
				updatepaths['responses.' + qollId + '.iscorrect'] = iscorrect;
				return QollstionnaireResponses.update({ _id : resp._id }, { $set : updatepaths });

			} else {//this qollid doesnt exist
				var newresponse;
				newresponse = {};
				newresponse = {
					submittedOn : new Date(),
					response : fib,
					type : QollConstants.QOLL_TYPE.BLANK,
					iscorrect : iscorrect
				};
				var updatepaths;
				updatepaths = {};
				updatepaths['responses.' + qollId] = newresponse;
				return QollstionnaireResponses.update({ _id : resp._id }, { $set : updatepaths });

			}
		}

	},
});

findQollRegisters = function(submittedBy, qollId) {
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
