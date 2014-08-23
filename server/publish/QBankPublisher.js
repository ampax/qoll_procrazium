var filename = 'server/publisher/QollPublisher.js';

/** Publishing to the subscribers method for qolls  **/
Meteor.publish('QBANK_SUMMARY_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle;
	qlog.info('Fetching all the qolls in desc order of creation; uuid -------> : ' + uuid + ', : ' + this.userId, filename);
	if (this.userId) {//first publish specialized qolls to this user
		var ufound = Meteor.users.find({
			"_id" : this.userId
		}).fetch();
		if (ufound.length > 0) {
			var user = ufound[0];

			//submitted by this user
			var handle = Qoll.find( 
				getQuery(findoptions), 
				{'qollTitle' : 1, 'qollText' : 1, 'qollRawId' : 1, 'submittedOn' : 1, 'qollTypesX' : 1, 'attributes' : 1}, 
				{sort : {'submittedOn' : -1}, reactive : true}
			).observe({
				added : function(item, idx) {
					qlog.info('Adding, qbid ' + JSON.stringify(item), filename);
					var q = {
						qollTitle : item.qollTitle,
 						qollText : item.qollText,
 						submittedOn : item.submittedOn,
 						viewContext : "createUsr",
 						_id : item._id,
						qollRawId : item.qollRawId,
						qollTypesX : item.qollTypesX,
						attributes : item.attributes
					};

					self.added('qbank_summary', item._id, q);

				},
				changed : function(item, idx) {

					var q = {
						qollTitle : item.qollTitle,
 						qollText : item.qollText,
 						submittedOn : item.submittedOn,
 						viewContext : "createUsr",
 						_id : item._id,
						qollRawId : item.qollRawId,
						qollTypesX : item.qollTypesX,
						attributes : item.attributes
					};

					self.changed('qbank_summary', item._id, q);

				},
				removed : function(item) {

					self.removed('qbank_summary', item._id);
					qlog.info('Removed item with id: ' + item._id);

				}
			});
		}

	}
	qlog.info('Done initializing the publisher: QBANK_SUMMARY_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle != undefined) handle.stop();
	});
});

Meteor.publish('GROUP_STATS_PUBLISHER', function(group_name) {
	var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_group_stats; //make a json of handles and close those in onStop call

	qlog.info('Fetching group performance; uuid: ' + uuid + ', group_name: ' + group_name + 'user - ' + this.userId, filename);
	if (user_id) {
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			var group = QollGroups.find({'groupName' : group_name}).fetch();
			if((group && group[0])) {
				group = group[0];
				qlog.info('user emails - ' + JSON.stringify(group), filename);
				group.userEmails.map(function(email){
					var user = Meteor.users.findOne({"profile.email" : email});
					if(user && user.profile) {
						var qollsts = Qoll.find({'is_parent' : true, 'submittedToGroup' : group_name});
						qollsts.map(function(qollst){
							Qoll.find({$or:[{'parentId' : qollst._id},{'_id' : qollst._id}]}, {sort : {'submittedOn' : 1}, reactive : true}).observe({
								added : function(item, idx){
									//Initialize the json object here so that it does not depend on existence of the registers
									var qollReg = QollRegister.find({qollId: item._id, submittedBy: user._id}).fetch()[0];
									//function(var qollSt, var q, var qollReg, var user)
									var stat = fetchQollPublishDetails(qollst, item, qollReg, user);
									//qlog.info('<==============Adding stat===============>' + JSON.stringify(item), filename);
									self.added('group-stats', item._id + user._id, stat);
								},
								changed : function(item, idx) {
									var qollReg = QollRegister.find({qollId: item._id, submittedBy: user._id}, {reactive : true});
									//function(var qollSt, var q, var qollReg, var user)
									var stat = fetchQollPublishDetails(qollst, item, qollReg, user);
									//qlog.info('<==============Changing stat===============>' + JSON.stringify(stat), filename);
									self.changed('group-stats', item._id + user._id, stat);

								},
								removed : function(item){
									self.removed('group-stats', item._id + user._id);
								}
							});
							
						});
					}
				});
			}
		}

	}

	qlog.info('Done initializing the group-stats publisher: GROUP_STATS_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_group_stats) handle_group_stats.stop();
	});
});


Meteor.publish('SENT_QUESTIONAIRE_PUBLISHER', function(findoptions) {
	var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_questionaires;
	if (user_id) {
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			
			handle_questionaires = Qollstionnaire.find({'submittedBy' : this.userId,'status' : QollConstants.STATUS.SENT}).observe({
				added : function(item, idx){
					self.added('sent-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.qolls_to_email.length, submitted_on : item.submittedOn});
				},
				changed : function(item, idx) {
					self.changed('sent-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.qolls_to_email.length, submitted_on : item.submittedOn});
				},
				removed : function(item){
					self.removed('sent-by-me-questionaire', item._id);
				}
			});
		}
	}

	qlog.info('Done initializing the sent-by-me-questionaire: SENT_QUESTIONAIRE_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_questionaires != undefined) handle_questionaires.stop();
	});
});

Meteor.publish('STORED_QUESTIONAIRE_PUBLISHER', function(findoptions) {
	var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_questionaires;
	if (user_id) {
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			
			handle_questionaires = Qollstionnaire.find({'submittedBy' : this.userId,'status' : QollConstants.STATUS.STORED}).observe({
				added : function(item, idx){
					self.added('stored-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.qolls_to_email.length, submitted_on : item.submittedOn});
				},
				changed : function(item, idx) {
					self.changed('stored-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.qolls_to_email.length, submitted_on : item.submittedOn});
				},
				removed : function(item){
					self.removed('stored-by-me-questionaire', item._id);
				}
			});
		}
	}

	qlog.info('Done initializing the stored-by-me-questionaire: STORED_QUESTIONAIRE_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_questionaires != undefined) handle_questionaires.stop();
	});
});

Meteor.publish('RECVD_QUESTIONAIRE_PUBLISHER', function(findoptions) {
	var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_questionaires;
	if (user_id) {
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			var user = ufound[0];

			//handle_questionaires = Qollstionnaire.find({'submittedBy' : this.userId,'status' : QollConstants.STATUS.SENT})
			
			handle_questionaires = Qollstionnaire.find({ 'submittedTo' : UserUtil.getEmail(user), 'status' : QollConstants.STATUS.SENT }, 
				{ sort : { 'submittedOn' : -1}, reactive : true }
			).observe({
				added : function(item, idx){
					self.added('recvd-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.qolls_to_email.length, submitted_on : item.submittedOn});
				},
				changed : function(item, idx) {
					self.changed('recvd-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.qolls_to_email.length, submitted_on : item.submittedOn});
				},
				removed : function(item){
					self.removed('recvd-questionaire', item._id);
				}
			});
		}
	}

	qlog.info('Done initializing the recvd-questionaire: STORED_QUESTIONAIRE_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_questionaires != undefined) handle_questionaires.stop();
	});
});

Meteor.publish('QUESTIONAIRE_FOR_ID_PUBLISHER', function(findoptions) {
	var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_questionaires;
	if (user_id) {
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			
			handle_questionaires = Qollstionnaire.find({'_id' : findoptions._id}).observe({
				added : function(item, idx){
					self.added('questionaire-for-id', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
							recips_count : item.qolls_to_email.length, submitted_on : item.submittedOn});
				},
				changed : function(item, idx) {
					self.changed('questionaire-for-id', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
							recips_count : item.qolls_to_email.length, submitted_on : item.submittedOn});
				},
				removed : function(item){
					self.removed('questionaire-for-id', item._id);
				}
			});
		}
	}

	qlog.info('Done initializing the qoll-for-questionaire-id: QOLL_FOR_QUESTIONAIRE_ID_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_questionaires != undefined) handle_questionaires.stop();
	});
});


Meteor.publish('QOLL_FOR_QUESTIONAIRE_ID_PUBLISHER', function(findoptions) {
	var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_questionaires;
	if (user_id) {
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			
			handle_questionaires = Qollstionnaire.find({'_id' : findoptions._id}).observe({
				added : function(item, idx){
					var qolls = [];
					Qoll.find({_id : {$in : item.qollids}}).map(function(q){

						var q1 = {
							qollTitle 		: q.qollTitle,
							qollText 		: q.qollText,
							qollTypes 		: translateToIndexedArray(q.qollTypes),
							qollTypesX 		: q.qollTypesX,
							qollStarAttributes : q.qollStarAttributes ? q.qollStarAttributes : {},
							qollAttributes 	: q.qollAttributes,
							submittedOn 	: q.submittedOn,
							submittedBy 	: q.submittedBy,
							submittedTo 	: q.submittedTo,
							action 			: q.action,
							enableEdit 		: q.action === 'store',
							stats 			: q.stats,
							//answers 		: fetch_answers(item),
							//totals 			: sumstats(q.stats),
							viewContext 	: "createUsr",
							isMultiple		: q.isMultiple,
							_qollstionnaireid : findoptions._id,
							_id : q._id,
							qollRawId : q.qollRawId
						};

						qolls.push(q1);
					});

					qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(qolls), filename);

					self.added('qoll-for-questionaire-id', item._id, 
						{qolls : qolls});
				},
				changed : function(item, idx) {
					var qolls = [];
					Qoll.find({_id : {$in : item.qollids}}).map(function(q){
						
						var q1 = {
							qollTitle 		: q.qollTitle,
							qollText 		: q.qollText,
							qollTypes 		: translateToIndexedArray(q.qollTypes),
							qollTypesX 		: q.qollTypesX,
							qollStarAttributes : q.qollStarAttributes ? q.qollStarAttributes : {},
							qollAttributes 	: q.qollAttributes,
							submittedOn 	: q.submittedOn,
							submittedBy 	: q.submittedBy,
							submittedTo 	: q.submittedTo,
							action 			: q.action,
							enableEdit 		: q.action === 'store',
							stats 			: q.stats,
							//answers 		: fetch_answers(item),
							//totals 			: sumstats(q.stats),
							viewContext 	: "createUsr",
							isMultiple		: q.isMultiple,
							_qollstionnaireid : findoptions._id,
							_id : q._id,
							qollRawId : q.qollRawId
						};

						qolls.push(q1);
					});

					qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(qolls), filename);

					self.changed('qoll-for-questionaire-id', item._id, 
						{qolls : qolls});
				},
				removed : function(item){
					self.removed('qoll-for-questionaire-id', item._id);
				}
			});
		}
	}

	qlog.info('Done initializing the qoll-for-questionaire-id: QOLL_FOR_QUESTIONAIRE_ID_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_questionaires != undefined) handle_questionaires.stop();
	});
});

var fetchQollPublishDetails = function(qollSt, q, qollReg, user) {
	//qlog.info('<=======This is the qoll we will use for fill in the blanks========>' + JSON.stringify(q), filename);
	var stat = {};
	stat['name'] = user.profile.name;
	stat['email'] = user.profile.email;
	stat['qollst'] = qollSt.qollText.length > 27 ? qollSt.qollText.substring(0,27) + '...' : qollSt.qollText;
	stat['qoll_snip'] = q.qollText.length > 47 ? q.qollText.substring(0,47) + '...' : q.qollText;
	stat['qoll'] = q.qollText;
	stat['is_multiple'] = q.qollAttributes && q.qollAttributes.type ? 
		(q.qollAttributes.type === QollConstants.QOLL_TYPE.MULTI ? true : false) : false;
	stat['qoll_type'] = q.qollAttributes && q.qollAttributes.type ? q.qollAttributes.type : '';
	stat['star_attributes'] = q.qollStarAttributes;

	//Set the correct answers for the qolls (if assigned from the editor)
	stat.correct_answers = new Array();
	var qtx_idx = 0;
	//qlog.info('=======>qollTypesX =====>' + JSON.stringify(q), filename)

	if(!q.is_parent && _.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], stat['qoll_type'])) {
		//handle fill in the blanks
		if(HashUtil.checkHash(q.qollStarAttributes) && HashUtil.checkHash(q.qollStarAttributes.answer)) {
			stat.correct_answers.push(q.qollStarAttributes.answer);
		} else {
			stat.correct_answers.push('--');
		}
	} else if(!q.is_parent && q.isMultiple){ //handle multiple choice questions
		q.qollTypesX.map(function(qtx){
			if(qtx.isCorrect && qtx.isCorrect === 1) stat.correct_answers.push(alphabetical[qtx_idx]);
			qtx_idx++;
		});
	}

	//set the derfault values for correct-answers answered
	if(stat.correct_answers.length == 0)
		stat.correct_answers.push('--');

	qlog.info('=======>qollTypesX =====------->' + stat.correct_answers + '/' + JSON.stringify(q), filename)

	stat.answers = new Array();

	//qlog.debug('==========================>qollReg==>' + JSON.stringify(qollReg), filename)

	if(qollReg && qollReg!= undefined  && !q.is_parent && qollReg.qollTypeVal &&
		stat['qoll_type'] && _.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], stat['qoll_type'])) {
		stat.answers.push(qollReg.qollTypeVal);
	} else if(qollReg && qollReg!= null && qollReg.qollTypeReg !=null && !q.is_parent) {
		//qlog.info('qollReg=================>' + qollReg + '<====================', filename);
		var idx = 0;
		qollReg.qollTypeReg.map(function(reg){
			if(reg === 1) {
				stat.answers.push(alphabetical[idx]);
			}
			idx++;
		});
		//qlog.info('<==============Adding stat===============>' + JSON.stringify(stat), filename);
		stat['is_parent'] = false;
		//self.added('group-stats', qollReg._id, stat);
	} else {
		//set the answers for parent (not that parent will have none in current implementation)
		stat.answers.push('---'); //Did not answer
		if(!q.is_parent) {
			stat['is_parent'] = false;
		} else {
			stat['is_parent'] = true;
		}
	}

	if(stat['qoll_type'] && _.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], stat['qoll_type']) && qollReg) {
		var ans  = qollReg.qollTypeVal;
		var cans = q.qollStarAttributes.answer;

		if(getUnitSelected(cans) === getUnitSelected(cans)){ 
			var ans1 = getAnswer(cans);
			var ans2 = getAnswer(ans);
			if(ans1 == undefined || ans2 == undefined || ans1 != ans2 ) {
				stat.did_pass = false;
			} else if(ans1 === ans2) {
				stat.did_pass = true;
			} else
				stat.did_pass = true; 
		}
		else stat.did_pass = false;

	}else if(JSON.stringify(stat.correct_answers) == JSON.stringify(stat.answers)) {
		stat.did_pass = true;
	} else {
		stat.did_pass = false;
	}

	//qlog.info('<=======This is the qoll we will use for fill in the blanks========>' + JSON.stringify(stat), filename);
	

	return stat;
};


var fetchGroupStats = function(item, group_name) {
	var stats = new Array();
	var group = QollGroups.find({'groupName' : group_name}).fetch();
	if(group) {
		group.userEmails.map(function(email) {
			//TODO
		});
	}
	return item;
};

var getAnswer = function(ansHash) {
	if(ansHash == undefined) return undefined;
	var val = ansHash.blankResponse;
	var base = ansHash.exponentBase? ansHash.exponentBase : 10;
	var pow = ansHash.power? ansHash.power : 0;
	var calc = val * Math.pow(base, pow);
	return calc;
};

var getUnitSelected = function(ansHash) {
	return ansHash && ansHash.unitSelected ? ansHash.unitSelected : '';
};

var getQuery = function(findoptions) {
	//Return default query if nothing specified for the type in the paramenters. Else return appropriate query parameter.
	var query = {$or: [{'submittedBy' : this.userId,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}}, 
										   {'attributes.visibility': QollConstants.QOLL.VISIBILITY.PUB}]};

	if(findoptions && findoptions.query_type){
		//Process for the type of data being queried
		if(findoptions.query_type === 'inbox') {
			//Return the data for inbox. This will be the data that the user has recieved and needs to respond.
			//These will be two kinds - (1) Single qoll questionaire & (2) Multiple qoll questionaire
		} else if(findoptions.query_type === 'sent') {
			//This will be everything from the questionaire table that you have sent to anyone
		} else if(findoptions.query_type === 'draft') {
			//This is all the questionaire that you navigated away from the page without saving/storing
		} else { 
			//This is all the qolls created by me or public qolls
			return query;
		}
	}

	//Else return the default query for data
	return query;
}

var translateToIndexedArray = function ( ar){
		if(!ar) return [];
		return ar.map(function (item,ix){ return {index : ix, value : item};});
};

