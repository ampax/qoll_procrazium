var filename = 'server/publisher/QollPublisher.js';

/** Publishing to the subscribers method for qolls  **/
Meteor.publish('QBANK_SUMMARY_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle;
	qlog.info('Fetching all the QBANK_SUMMARY_PUBLISHER in desc order of creation; uuid -------> : ' + uuid + ', : ' + this.userId, filename);
	qlog.info('optiiiioooons -> '+ JSON.stringify(findoptions) + findoptions.userId, filename);
	if (this.userId || findoptions.userId /* userId coming from ionic app */) {//first publish specialized qolls to this user
		var tuid = this.userId ? this.userId : findoptions.userId;
		var ufound = Meteor.users.find({
			"_id" : tuid
		}).fetch();

		if (ufound.length > 0) {
			var user = ufound[0];

			findoptions.userId = user._id;

			qlog.info('Printing the user for this request ===========> ' + JSON.stringify(findoptions), filename);

			//submitted by this user
			var qry = getQuery(findoptions);
			qlog.info('Query ===================> '+ JSON.stringify(qry));
			var handle = Qoll.find( qry, {sort : {'submittedOn' : -1}, reactive : true} ).observe({
				added : function(item, idx) {
					qlog.info('Adding, qbid ' + JSON.stringify(item), filename);
					var q = {
						qollTitle 		: item.title,
 						qollText 		: item.qollText,
 						submittedOn 	: item.submittedOn,
 						viewContext 	: "createUsr",
 						_id 			: item._id,
						qollRawId 		: item.qollRawId,
						qollTypesX 		: item.qollTypesX,
						cat 			: item.cat,
						unit_name 		: item.unit_name,
						unit 			: item.unit,
						visibility 		: item.visibility,
						complexity 		: item.complexity,
						imageIds		: item.imageIds,
						isOwner			: item.submittedBy == user._id,
					};

					q = QollKatexUtil.populateIfTex(q, item);

					self.added('qbank_summary', item._id, q);

				},
				changed : function(item, idx) {

					var q = {
						qollTitle 		: item.title,
 						qollText 		: item.qollText,
 						submittedOn 	: item.submittedOn,
 						viewContext 	: "createUsr",
 						_id 			: item._id,
						qollRawId 		: item.qollRawId,
						qollTypesX 		: item.qollTypesX,
						cat 			: item.cat,
						unit_name 		: item.unit_name,
						unit 			: item.unit,
						visibility 		: item.visibility,
						complexity 		: item.complexity,
						imageIds		: item.imageIds,
						isOwner			: item.submittedBy == user._id,
					};

					q = QollKatexUtil.populateIfTex(q, item);

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
	qlog.info('Printing findoptions from SENT_QUESTIONAIRE_PUBLISHER =====>' + JSON.stringify(findoptions), filename);
	if (this.userId || findoptions.userId /* userId coming from ionic app */) {//first publish specialized qolls to this user
		var tuid = this.userId ? this.userId : findoptions.userId;
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : tuid}).fetch();
		if (ufound.length > 0) {
			var user = ufound[0];
			
			handle_questionaires = Qollstionnaire.find({'submittedBy' : user._id,'status' : QollConstants.STATUS.SENT}, 
				{sort : {'submittedOn' : -1}, reactive : true}).observe({
				added : function(item, idx){
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					var r = getQuestCompletionRate(item);
					qlog.info("Adding item to SENT_QUESTIONAIRE_PUBLISHER =======>" + JSON.stringify(item), filename);
					self.added('sent-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.submittedTo.length, 
							submitted_on : item.submittedOn, closed_on : item.qollstionnaireClosedOn,
							length_class : length_class, respo_length : r.respo_length, recip_length : r.recip_length});
				},
				changed : function(item, idx) {
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					var r = getQuestCompletionRate(item);
					self.changed('sent-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.submittedTo.length, 
							submitted_on : item.submittedOn, closed_on : item.qollstionnaireClosedOn,
							length_class : length_class, respo_length : r.respo_length, recip_length : r.recip_length});
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
	if (this.userId || findoptions.userId /* userId coming from ionic app */) {//first publish specialized qolls to this user
		var tuid = this.userId ? this.userId : findoptions.userId;
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : tuid}).fetch();
		if (ufound.length > 0) {
			var user = ufound[0];
			
			handle_questionaires = Qollstionnaire.find({'submittedBy' : user._id,'status' : QollConstants.STATUS.STORED},
					{ sort : { 'submittedOn' : -1}, reactive : true }).observe({
				added : function(item, idx){
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					self.added('stored-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.submittedTo.length, submitted_on : item.submittedOn, length_class : length_class});
				},
				changed : function(item, idx) {
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					self.changed('stored-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.submittedTo.length, submitted_on : item.submittedOn, length_class : length_class});
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

	qlog.info('Printing findoptions ---------------> ' + JSON.stringify(findoptions), filename);

	if (this.userId || findoptions.userId /* userId coming from ionic app */) {//first publish specialized qolls to this user
		var tuid = this.userId ? this.userId : findoptions.userId;
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : tuid}).fetch();
		if (ufound.length > 0) {
			var user = ufound[0];

			qlog.info('Found user - ' + JSON.stringify(user), filename);

			//handle_questionaires = Qollstionnaire.find({'submittedBy' : this.userId,'status' : QollConstants.STATUS.SENT})

			handle_questionaires = Qollstionnaire.find({ 'submittedTo' : UserUtil.getEmail(user), 'status' : QollConstants.STATUS.SENT }, 
				{ sort : { 'submittedOn' : -1}, reactive : true }
			).observe({
				added : function(item, idx){
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					var pub = {_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
						recips_count : item.submittedTo.length, submitted_on : item.submittedOn, closed_on : item.qollstionnaireClosedOn,
						length_class : length_class};
					
					var resp = QollstionnaireResponses.findOne({
						qollstionnaireid : item._id,
						usrid : user._id
					});

					if(resp) {
						pub.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						pub.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					self.added('recvd-questionaire', item._id, pub);
				},
				changed : function(item, idx) {
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					var pub = {_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
						recips_count : item.submittedTo.length, submitted_on : item.submittedOn, closed_on : item.qollstionnaireClosedOn,
						length_class : length_class};
					
					var resp = QollstionnaireResponses.findOne({
						qollstionnaireid : item._id,
						usrid : user._id
					});
					
					if(resp) {
						pub.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						pub.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					self.changed('recvd-questionaire', item._id, pub);
				},
				removed : function(item){
					self.removed('recvd-questionaire', item._id);
				}
			});
		}
	}

	qlog.info('Done initializing the recvd-questionaire: RECVD_QUESTIONAIRE_PUBLISHER, uuid: ' + uuid, filename);
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

	if (this.userId || findoptions.userId /* userId coming from ionic app */) {//first publish specialized qolls to this user
		//Check for existing user record
		var tuid = this.userId ? this.userId : findoptions.userId;
		var ufound = Meteor.users.find({
			"_id" : tuid
		}).fetch();

		if (ufound.length > 0) {
			var user = ufound[0];

			var resp = QollstionnaireResponses.findOne({
				qollstionnaireid : findoptions._id,
				usrid : user._id
			});
			
			handle_questionaires = Qollstionnaire.find({'_id' : findoptions._id}).observe({
				added : function(item, idx){
					var questionaire = {_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
							recips_count : item.submittedTo.length, submitted_on : item.submittedOn, category : item.category,
							qollstionnaire_closed : item.qollstionnaireClosed, qollstionnaire_closed_on : item.qollstionnaireClosedOn};

					if(findoptions.stats){
						var r = getQuestionnaireResponses(item);
						questionaire.stats = r.stats;
						questionaire.stats_labels = r.labels;
						questionaire.respo_length = r.respo_length;
						questionaire.recip_length = r.recip_length;
					}

					if(resp) {
						questionaire.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						questionaire.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					qlog.info('+++++++++++++++++> ' + JSON.stringify(questionaire), filename);

					self.added('questionaire-for-id', item._id, questionaire);
				},
				changed : function(item, idx) {
					var questionaire = {_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
							recips_count : item.submittedTo.length, submitted_on : item.submittedOn, category : item.category,
							qollstionnaire_closed : item.qollstionnaireClosed, qollstionnaire_closed_on : item.qollstionnaireClosedOn};

					if(findoptions.stats){
						var r = getQuestionnaireResponses(item);
						questionaire.stats = r.stats;
						questionaire.stats_labels = r.labels;
						questionaire.respo_length = r.respo_length;
						questionaire.recip_length = r.recip_length;
					}

					if(resp) {
						questionaire.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						questionaire.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					self.changed('questionaire-for-id', item._id, questionaire);
				},
				removed : function(item){
					self.removed('questionaire-for-id', item._id);
				}
			});
		}
	}

	qlog.info('Done initializing the questionaire-for-id: QUESTIONAIRE_FOR_ID_PUBLISHER, uuid: ' + uuid, filename);
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

	qlog.info('====================> ' + findoptions, filename);

	if (this.userId || findoptions.userId /* userId coming from ionic app */) {//first publish specialized qolls to this user
		var tuid = this.userId ? this.userId : findoptions.userId;
		var ufound = Meteor.users.find({
			"_id" : tuid
		}).fetch();

		if (ufound.length > 0) {
			var user = ufound[0];

			qlog.info('Found user-id - ' + JSON.stringify(user), filename);

			var resp = QollstionnaireResponses.findOne({
				qollstionnaireid : findoptions._id,
				usrid : user._id
			});
			qlog.info('=== === === ===> {'+findoptions._id+'}' + JSON.stringify(resp), filename);
			handle_questionaires = Qollstionnaire.find({'_id' : findoptions._id}).observe({
				added : function(item, idx){
					var qolls = [];
					var counter = 1;
					item.qollids.map(function(qid){
						
						var q = Qoll.find({_id : qid}).map(function(t){
							var thisresponse; 
							thisresponse = resp && resp.responses[qid]? resp.responses[qid].response:new Array(t.qollTypes?t.qollTypes.length:0) ;
							var response = resp && resp.responses[qid] ? resp.responses[qid] : undefined;
							var used_hint = resp && resp.responses[qid] ? resp.responses[qid].usedHint : undefined;
							
							var q2 = extractQollDetails(t);
							q2.myresponses = thisresponse;
							q2._qollstionnaireid = findoptions._id;
							q2.qoll_idx_title = '(Q'+counter+++')';
							q2.context = findoptions.context;
							q2.qoll_response = response;

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							q2 = QollRandomizer.randomize(q2);

							q2 = QollKatexUtil.populateIfTex(q2, t);

							//if submitted, do not let register any more answers
							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
								q2.context = QollConstants.CONTEXT.READ;
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {questTitle : item.title, questSize	: item.qollids.length, questId : item._id,
								 status : item.status, qollstionnaireClosed : item.qollstionnaireClosed, 
								 qollstionnaireClosedOn : item.qollstionnaireClosedOn};

					if(resp && resp.qollstionnaireSubmitted == true) {
						quest.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						quest.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					if(user._id === item.submittedBy) {
						// send more information at the questionnaire level so that owner gets to see how people have responded
						quest.questSubmittedTo  = item.submittedTo;
						quest.questResponse = getQuestionnaireResponses(item);
					}

					qlog.info('Pushing qolls to client ++++++++++++++++++> ' + JSON.stringify(quest), filename);

					var pub = {qolls : qolls, questionaire : quest};

					if(quest.questResponse) {
						pub.stats = quest.questResponse.stats;
					}

					self.added('qoll-for-questionaire-id', item._id, pub);
				},
				changed : function(item, idx) {
					var qolls = [];
					var counter = 1;
					item.qollids.map(function(qid){
						
						var q = Qoll.find({_id : qid}).map(function(t){
							var thisresponse; 
							thisresponse = resp && resp.responses[qid]? resp.responses[qid].response:new Array(t.qollTypes?t.qollTypes.length:0) ;
							var response = resp && resp.responses[qid] ? resp.responses[qid] : undefined;
							
							var q2 = extractQollDetails(t);
							q2.myresponses = thisresponse;
							q2._qollstionnaireid = findoptions._id;
							q2.qoll_idx_title = '(Q'+counter+++')';
							q2.context = findoptions.context;
							q2.qoll_response = response;

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							q2 = QollRandomizer.randomize(q2);

							q2 = QollKatexUtil.populateIfTex(q2, t);

							//if submitted, do not let register any more answers
							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
								q2.context = QollConstants.CONTEXT.READ;
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {questTitle : item.title, questSize	: item.qollids.length, questId : item._id,
								 status : item.status, qollstionnaireClosed : item.qollstionnaireClosed, 
								 qollstionnaireClosedOn : item.qollstionnaireClosedOn};

					if(resp && resp.qollstionnaireSubmitted == true) {
						quest.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						quest.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					if(user._id === item.submittedBy) {
						// send more information at the questionnaire level so that owner gets to see how people have responded
						quest.questSubmittedTo  = item.submittedTo;
						quest.questResponse = getQuestionnaireResponses(item);
					}

					var pub = {qolls : qolls, questionaire : quest};

					if(quest.questResponse) {
						pub.stats = quest.questResponse.stats;
					}

					//qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(qolls), filename);

					self.changed('qoll-for-questionaire-id', item._id, pub);
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
		if(handle_questionaires != undefined) {
			handle_questionaires.stop();
		}
	});
});


Meteor.publish('QUICKER_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var lim = QollConstants.QOLL.PUBLISH_SIZE;
	var targetDate = findoptions.submittedOn;
	var groupName = findoptions.groupName;
	var handle_my_active_qolls;

	var handle_quicker = undefined;

	if(!targetDate) {
		targetDate = new Date();
		targetDate.setDate(targetDate.getDate() - QollConstants.BATTLEG.LOOKBACK);
	}

	qlog.info('Fetching all the qolls battle-ground: ' + uuid, filename);
	if (this.userId || findoptions.userId /* userId coming from ionic app */) {//first publish specialized qolls to this user
		var tuid = this.userId ? this.userId : findoptions.userId;
		var ufound = Meteor.users.find({
			"_id" : tuid
		}).fetch();
		
		if (ufound.length > 0) {
			//User found, will publish different qolls to user now
			var user = ufound[0];

			//Publishing my own created qolls (in chunks of 100) --- (1) My own created qolls - all created by me, and not yet archived
			//var counter = 1;
			handle_quicker = Qollstionnaire.find({ 'submittedTo' : UserUtil.getEmail(user), 'status' : QollConstants.STATUS.SENT, 
				'category' : 'quicker'}, 
				{ sort : { 'submittedOn' : -1}, reactive : true }
			).observe({
				added : function(item, idx){
					//var qolls = [];
					//var counter = 1;
					
					var resp = QollstionnaireResponses.findOne({
						qollstionnaireid : item._id,
						usrid : user._id
					});

					item.qollids.map(function(qid, idx){
						
						var q = Qoll.find({_id : qid}).map(function(t){
							var thisresponse; 
							thisresponse = resp && resp.responses[qid]? resp.responses[qid].response:new Array(t.qollTypes?t.qollTypes.length:0) ;
							var response = resp && resp.responses[qid] ? resp.responses[qid] : undefined;
							
							var q2 = extractQollDetails(t);
							q2.myresponses = thisresponse;
							q2._qollstionnaireid = item._id;
							q2.status = item.status;
							q2.action = item.status;
							q2.qoll_idx_title = '(Q).';
							q2.context = findoptions.context;
							q2.qoll_response = response;

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib) + 
								'/' + JSON.stringify(resp) + '/' + item._id + '/' + user._id, filename);

							//qolls.push(q2);
							self.added('quicker-qolls', qid, q2);
						});
					});

					//var quest = {questTitle : item.title, questSize	: item.qollids.length};

					//self.added('battleground', item._id, {qolls : qolls, questionaire : quest});
				},
				changed : function(item, idx) {
					var qolls = [];
					var counter = 1;
					
					var resp = QollstionnaireResponses.findOne({
						qollstionnaireid : item._id,
						usrid : this.userId
					});

					item.qollids.map(function(qid, idx){
						
						var q = Qoll.find({_id : qid}).map(function(t){
							var thisresponse; 
							thisresponse = resp && resp.responses[qid]? resp.responses[qid].response:new Array(t.qollTypes?t.qollTypes.length:0) ;
							var response = resp && resp.responses[qid] ? resp.responses[qid] : undefined;
							
							var q2 = extractQollDetails(t);
							q2.myresponses = thisresponse;
							q2._qollstionnaireid = item._id;
							q2.status = item.status;
							q2.action = item.status;
							q2.qoll_idx_title = '(Q).';
							q2.context = findoptions.context;
							q2.qoll_response = response;

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							//qolls.push(q2);
							self.changed('quicker-qolls', qid, q2);
						});
					});

					//var quest = {questTitle : item.title, questSize	: item.qollids.length};

					//self.changed('battleground', item._id, {qolls : qolls, questionaire : quest});
				},
				removed : function(item){
					item.qollids.map(function(qid, idx){
						self.removed('quicker-qolls', qid);
					});
				}
			});
			
		}

	}
	qlog.info('Done initializing the publisher: QUICKER_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		handle_quicker.stop();
	});
});


/**
	Qoll for 
		(1) qoll-id
	
	Response for 
		(1) questionaire-id
		(2) qoll_id
		(3) responder-id
**/

Meteor.publish('BATTLEG_QUESTIONAIRE_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var lim = QollConstants.QOLL.PUBLISH_SIZE;
	var targetDate = findoptions.submittedOn;
	var groupName = findoptions.groupName;
	var handle_my_active_qolls;

	if(!targetDate) {
		targetDate = new Date();
		targetDate.setDate(targetDate.getDate() - QollConstants.BATTLEG.LOOKBACK);
	}

	qlog.info('Fetching all the qolls battle-ground: ' + uuid, filename);
	if (this.userId) {
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			//User found, will publish different qolls to user now
			var user = ufound[0];

			//Publishing my own created qolls (in chunks of 100) --- (1) My own created qolls - all created by me, and not yet archived
			//var counter = 1;
			handle_questionaires = Qollstionnaire.find({ 'submittedTo' : UserUtil.getEmail(user), 'status' : QollConstants.STATUS.SENT, 
				'submittedOn' : {$gt : targetDate}}, 
				{ sort : { 'submittedOn' : -1}, reactive : true }
			).observe({
				added : function(item, idx){
					//var qolls = [];
					//var counter = 1;
					
					var resp = QollstionnaireResponses.findOne({
						qollstionnaireid : item._id,
						usrid : user._id
					});

					item.qollids.map(function(qid, idx){
						
						var q = Qoll.find({_id : qid}).map(function(t){
							var thisresponse; 
							thisresponse = resp && resp.responses[qid]? resp.responses[qid].response:new Array(t.qollTypes?t.qollTypes.length:0) ;
							var response = resp && resp.responses[qid] ? resp.responses[qid] : undefined;
							
							var q2 = extractQollDetails(t);
							q2.myresponses = thisresponse;
							q2._qollstionnaireid = item._id;
							q2.status = item.status;
							q2.action = item.status;
							q2.qoll_idx_title = '(Q).';
							q2.context = findoptions.context;
							q2.qoll_response = response;

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib) + 
								'/' + JSON.stringify(resp) + '/' + item._id + '/' + user._id, filename);

							//qolls.push(q2);
							self.added('battleground', qid, q2);
						});
					});

					//var quest = {questTitle : item.title, questSize	: item.qollids.length};

					//self.added('battleground', item._id, {qolls : qolls, questionaire : quest});
				},
				changed : function(item, idx) {
					var qolls = [];
					var counter = 1;
					
					var resp = QollstionnaireResponses.findOne({
						qollstionnaireid : item._id,
						usrid : this.userId
					});

					item.qollids.map(function(qid, idx){
						
						var q = Qoll.find({_id : qid}).map(function(t){
							var thisresponse; 
							thisresponse = resp && resp.responses[qid]? resp.responses[qid].response:new Array(t.qollTypes?t.qollTypes.length:0) ;
							var response = resp && resp.responses[qid] ? resp.responses[qid] : undefined;
							
							var q2 = extractQollDetails(t);
							q2.myresponses = thisresponse;
							q2._qollstionnaireid = item._id;
							q2.status = item.status;
							q2.action = item.status;
							q2.qoll_idx_title = '(Q).';
							q2.context = findoptions.context;
							q2.qoll_response = response;

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							//qolls.push(q2);
							self.changed('battleground', qid, q2);
						});
					});

					//var quest = {questTitle : item.title, questSize	: item.qollids.length};

					//self.changed('battleground', item._id, {qolls : qolls, questionaire : quest});
				},
				removed : function(item){
					item.qollids.map(function(qid, idx){
						self.removed('battleground', qid);
					});
				}
			});
			
		}

	}
	qlog.info('Done initializing the publisher: BATTLEG_QOLL_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		handle_questionaires.stop();
	});
});


Meteor.publish('QUESTIONAIRE_PROGRESS_PUBLISHER', function(findoptions) {
	var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_questionaires;
	var counter = 0;

	if (this.userId || findoptions.userId /* userId coming from ionic app */) {//first publish specialized qolls to this user
		var tuid = this.userId ? this.userId : findoptions.userId;
		var ufound = Meteor.users.find({
			"_id" : tuid
		}).fetch();
		//Check for existing user record
		// var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			var user = ufound[0];
			handle_questionaires = QollstionnaireResponses.find({ qollstionnaireid : findoptions._id, usrid : user._id }, { reactive : true }).observe({
				added : function(item, idx){
					counter++;
					
					if (!initializing)
						self.changed('questionaire-progress', findoptions._id, {progress : counter});
				},
				changed : function(item, idx){
					counter++;
					self.changed('questionaire-progress', findoptions._id, {progress : counter});
				},/**,
				changed : function(item, idx) {
					var questionaire = {_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
							recips_count : item.submittedTo.length, submitted_on : item.submittedOn};

					if(findoptions.stats){
						var r = getQuestionnaireResponses(item);
						questionaire.stats = r.stats;
						questionaire.stats_labels = r.labels;
						questionaire.respo_length = r.respo_length;
						questionaire.recip_length = r.recip_length;
					}

					self.changed('questionaire-for-id', item._id, questionaire);
				},**/
				removed : function(item){
					counter--;
					self.changed('questionaire-progress', findoptions._id, {progress : counter});
				}
			});
			//self.added('questionaire-progress', findoptions._id, {progress : counter});
		}
	}

	qlog.info('Done initializing the questionaire-progress: QUESTIONAIRE_PROGRESS_PUBLISHER, uuid: ' + uuid, filename);
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
	stat['is_multiple'] = q.cat ? (q.cat === QollConstants.QOLL_TYPE.MULTI ? true : false) : false;
	stat['qoll_type'] = q.cat ? q.cat : '';
	stat['cat'] = q.cat;
	stat['unit_name'] = q.unit_name;
	stat['unit'] = q.unit;
	stat['visibility'] = q.visibility;
	stat['complexity'] = q.complexity;

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
	qlog.info("===========> " + findoptions, filename);
	var tuid = findoptions.userId; // this.userId ? this.userId : findoptions.userId;
	var ufound = Meteor.users.find({ "_id" : tuid }).fetch();

	// var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
	var user = ufound[0];
	var groups = QollGroups.find({'userEmails' : UserUtil.getEmail(user)})
	var grps = [];
	groups.map(function(gr){
		grps.push(gr.groupName);
	});

	qlog.info('Pushed groups before making the query =============>>>> ' + grps + '/' + tuid, filename);
	
	var query = {$or: [ {'submittedBy' : user._id,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}}, 
						{'visibility': QollConstants.QOLL.VISIBILITY.PUB,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}},
						{'visibility': QollConstants.QOLL.VISIBILITY.PVT,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE},
							accessToGroups : {$in : grps}}
					]};

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
};

var translateToIndexedArray = function ( ar){
		if(!ar) return [];
		return ar.map(function (item,ix){ return {index : ix, value : item};});
};

var extractQollDetails = function(q) {
	return {
		qollTitle 		: q.title,
		title 			: q.title,
		qollText 		: q.qollText,
		qollTypes 		: translateToIndexedArray(q.qollTypes),
		qollTypesX 		: q.qollTypesX,

		cat 			: q.cat,
		answer 			: q.answer,
		fib 			: q.fib,
		hint 			: q.hint,
		unit_name 		: q.unit_name,
		unit 			: q.unit,
		visibility 		: q.visibility,
		complexity 		: q.complexity,
		//qollStarAttributes : q.qollStarAttributes ? q.qollStarAttributes : {},
		//qollAttributes 	: q.qollAttributes,
		submittedOn 	: q.submittedOn,
		submittedBy 	: q.submittedBy,
		submittedTo 	: q.submittedTo,
		action 			: q.action,
		enableEdit 		: q.action === 'store',
		stats 			: q.stats,
		viewContext 	: "createUsr",
		isMultiple		: q.isMultiple,
		imageIds		: q.imageIds,
		_id 			: q._id,
		qollRawId 		: q.qollRawId
	};
};

var getQuestCompletionRate = function(item) {
	var r = {};
	var counter = 0;

	QollstionnaireResponses.find({ qollstionnaireid : item._id }).map(function(i){
		counter++;
	});

	r.respo_length = counter;
	r.recip_length = item.submittedTo.length;

	return r;
};

var getQuestionnaireResponses = function(item) {
	var stats = [];
	var labels = [];
	var r = {};
	var respo_length = 0;
	var qoll_text_hash = {};

	//Initialize the labels here as we will show the table always, whether or not some one has attempted to answer
	labels.push({label : 'Name'});
	var counter = 1;
	item.qollids.map(function(qid){
		labels.push({label : 'Q' + counter++});
		var t = Qolls.QollDb.get({_id : qid});
		qoll_text_hash[qid] = {qollText : t.qollText, title : t.title, qollCat : t.cat};
	});

	item.submittedTo.map(function(subTo){
		var u1 = Meteor.users.find({'emails.address' : subTo}).fetch();
		var stat = {}; //{name : 'Anoop Kaushik', responses : [{response : 'A'}, {response : 'B,C'}]}
		var responses = [];
		var name = undefined;
		var resp = undefined;
		var resp_flag = false;

		if(u1.length > 0) { 
			name = u1[0].profile.name;
			resp = QollstionnaireResponses.findOne({ qollstionnaireid : item._id, usrid : u1[0]._id });
		} else {
			name = subTo;
			resp = QollstionnaireResponses.findOne({ qollstionnaireid : item._id, email : subTo });
		}

		var counter_x = 1;
		item.qollids.map(function(qid){
			if(resp && resp.responses[qid]) {
				var cnt1 = 0;
				var attach_resp = [];
				var rtmp = resp.responses[qid];
				
				if(rtmp.type.toLowerCase() === QollConstants.QOLL_TYPE.MULTI || rtmp.type === QollConstants.QOLL.TYPE.SINGLE) {
					rtmp.response.map(function(tmp){
						qlog.info('Printing response ------------>>>>>> ' + tmp + '////' + rtmp.type);
						
							if(tmp == true || tmp === 'true'){
								attach_resp.push(IndexAbbreviations.alphabetical[cnt1]);
							};
							cnt1++;
						
					});
				} else if(rtmp.type.toLowerCase() === QollConstants.QOLL_TYPE.BLANK) {
					attach_resp.push(rtmp.response);
				}

				responses.push({
								'response' : attach_resp.join(', '), 'usedHint' : rtmp.usedHint, 
								'unit_selected' : rtmp.unit, label : 'Q' + counter_x++,
								responses : attach_resp, iscorrect : rtmp.iscorrect,
								name : name, email : subTo, qollText : qoll_text_hash[qid].qollText,
								title : qoll_text_hash[qid].title, qoll_id : qid, cat : qoll_text_hash[qid].qollCat
							});

				if(!resp_flag) {
					respo_length++;
					resp_flag = true;
				}

			} else {
				responses.push({
								'response' : 'NA', 'unit_selected' : undefined, label : 'Q' + counter_x++, responses : [],
								name : name, email : subTo, qollText : qoll_text_hash[qid].qollText,
								title : qoll_text_hash[qid].title, qoll_id : qid, cat : qoll_text_hash[qid].qollCat
								});
			}
		});

		/**if(resp) {
			resp.responses.map(function(r){
				qlog.info('Printing response - ' + JSON.stringify(r));
				var attach_resp = [];
				if(r.type === QollConstants.QOLL.TYPE.MULTIPLE || r.type === QollConstants.QOLL.TYPE.SINGLE) {
					var cnt1 = 0;
					r.response.map(function(tmp){
						attach_resp.push(IndexAbbreviations.alphabetical[cnt1++]);
					});
				}

				responses.push({'response' : attach_resp.join(', ')});
			});
		}**/

		stat.name = name;
		stat.email = subTo;
		stat.questionaire_id = item._id;
		stat.responses = responses;

		if(resp && resp.qollstionnaireSubmitted === true) {
			stat.qollstionnaireSubmitted = resp.qollstionnaireSubmitted;
			stat.qollstionnaireSubmittedOn = resp.qollstionnaireSubmittedOn;
		}

		stats.push(stat);

		qlog.info(filename, '===============>'+ subTo + '/' + name + '<===============');
	});

	r.stats = stats;
	r.labels = labels;
	r.respo_length = respo_length;
	r.recip_length = item.submittedTo.length;

	qlog.info('===============>' + JSON.stringify(r) + '<===============');

	return r;
};

var questResponsesForOwner = function(item) {
	//
	item.submittedTo.map(function(subTo){
		var u1 = Meteor.users.find({'emails.address' : subTo}).fetch();

		if(u1.length > 0) { 
			name = u1[0].profile.name;
			resp = QollstionnaireResponses.findOne({ qollstionnaireid : item._id, usrid : u1[0]._id });
		} else {
			name = subTo;
			resp = QollstionnaireResponses.findOne({ qollstionnaireid : item._id, email : subTo });
		}

		item.qollids.map(function(qid){
			if(resp && resp.responses[qid]) {
				var rtmp = resp.responses[qid];

				if(rtmp.type.toLowerCase() === QollConstants.QOLL_TYPE.MULTI || rtmp.type === QollConstants.QOLL.TYPE.SINGLE) {
					rtmp.response.map(function(tmp){
						qlog.info('Printing response ------------>>>>>> ' + tmp + '////' + rtmp.type);
						
							if(tmp == true || tmp === 'true'){
								attach_resp.push(IndexAbbreviations.alphabetical[cnt1]);
							};
							cnt1++;
						
					});
				} else if(rtmp.type.toLowerCase() === QollConstants.QOLL_TYPE.BLANK) {
					attach_resp.push(rtmp.response);
				}

				responses.push({'response' : attach_resp.join(', '), 'usedHint' : rtmp.usedHint, 'unit_selected' : rtmp.unit});
			} else {
				responses.push({'response' : 'NA', 'unit_selected' : undefined});
			}
		});
	});
};

