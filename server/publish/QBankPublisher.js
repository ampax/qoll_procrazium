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
			findoptions.share_circle = user.share_circle;

			qlog.info('Printing the user for this request ===========> ' + JSON.stringify(findoptions), filename);

			//submitted by this user
			var qry = getQuery(findoptions);
			qlog.info('Query ===================> '+ JSON.stringify(qry));
			var handle = Qoll.find( qry, {sort : {'submittedOn' : -1}, reactive : true} ).observe({
				added : function(item, idx) {
					// qlog.info('Adding, qbid ' + JSON.stringify(item), filename);
					var q = {
						qollTitle 		: item.title,
 						qollText 		: item.qollText,
 						submittedOn 	: item.submittedOn,
 						viewContext 	: "createUsr",
 						_id 			: item._id,
						qollRawId 		: item.qollRawId,
						qollTypesX 		: item.qollTypesX,
						cat 			: item.cat,
						fib 			: item.fib,
						tex 			: item.tex,
						texMode			: item.texMode? item.texMode : QollConstants.TEX_MODE.MATHJAX,
						unit_name 		: item.unit_name,
						unit 			: item.unit,
						visibility 		: item.visibility,
						complexity 		: item.complexity,
						imageIds		: item.imageIds,
						isOwner			: item.submittedBy == user._id,
						submittedBy		: item.submittedBy,
						share_circle 	: item.share_circle,
						hint 			: item.hint,
						tags 			: item.tags,
						topics 			: item.topics && item.topics != null? item.topics : ["Unassigned"],
					};

					q = populateAuthorMetaData(q, tuid);

					// q = QollKatexUtil.populateIfTex(q, item);

					qlog.info('-------------------------------> ' + q.topics, filename);

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
						fib 			: item.fib,
						tex 			: item.tex,
						texMode			: item.texMode? item.texMode : QollConstants.TEX_MODE.MATHJAX,
						unit_name 		: item.unit_name,
						unit 			: item.unit,
						visibility 		: item.visibility,
						complexity 		: item.complexity,
						imageIds		: item.imageIds,
						isOwner			: item.submittedBy == user._id,
						submittedBy		: item.submittedBy,
						share_circle 	: item.share_circle,
						hint 			: item.hint,
						tags 			: item.tags,
						topics 			: item.topics && item.topics != null? item.topics : ["Unassigned"],
					};

					q = populateAuthorMetaData(q, tuid);

					// q = QollKatexUtil.populateIfTex(q, item);

					qlog.info('-------------------------------> ' + q.topics, filename);

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

Meteor.publish('QBANK_TOPICS_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle;
	qlog.info('Fetching all the QBANK_TOPICS_PUBLISHER in desc order of creation; uuid -------> : ' + uuid + ', : ' + this.userId, filename);
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
			var handle = QollTopicsFavs.find( {'subscriber' : user._id}, {reactive : true} ).observe({
				added : function(item, idx) {
					qlog.info('Adding the topic ------------------------>' + JSON.stringify(item), filename);
					self.added('qbank_topics', item._id, item);
				},
				changed : function(item, idx) {
					qlog.info('Adding the topic ------------------------>' + JSON.stringify(item), filename);
					self.changed('qbank_topics', item._id, item);
				},
				removed : function(item) {
					self.removed('qbank_topics', item._id);
					qlog.info('Removed item with id: ' + item._id);

				}
			});
		}

	}
	qlog.info('Done initializing the publisher: QBANK_TOPICS_PUBLISHER, uuid: ' + uuid, filename);
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

			var query_array = [];
			query_array.push({'submittedBy' : user._id,'status' : QollConstants.STATUS.SENT}); // questionnaires of me

			var share_circle = user.share_circle;
			if(share_circle && share_circle.length > 0) {
				// add the query to compare the two arrays here
				// query_array.push({'share_circle' : share_circle});
				query_array.push({ share_circle: { $all: share_circle } }); // questionnaire created by those in my circle
			}

			qlog.info('SENT_QUESTIONAIRE_PUBLISHER query ==========> ' + JSON.stringify(query_array), filename);
			
			handle_questionaires = Qollstionnaire.find({$or : query_array}, {sort : {'submittedOn' : -1}, reactive : true}).observe({
				added : function(item, idx){
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					var r = getQuestCompletionRate(item);

					item = populateAuthorMetaData(item, tuid);

					qlog.info("Adding item to SENT_QUESTIONAIRE_PUBLISHER =======>" + JSON.stringify(item), filename);
					self.added('sent-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.submittedTo.length, 
							submitted_on : item.submittedOn, closed_on : item.qollstionnaireClosedOn, 
							tags : item.tags, topics  : item.topics && item.topics != null? item.topics : ["Unassigned"],
							byUser : item.byUser, fromSource : item.fromSource, onDate : item.onDate, closedOn : item.qollstionnaireClosedOn,
							length_class : length_class, respo_length : r.respo_length, recip_length : r.recip_length});
				},
				changed : function(item, idx) {
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					var r = getQuestCompletionRate(item);

					item = populateAuthorMetaData(item, tuid);

					self.changed('sent-by-me-questionaire', item._id, 
						{_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, recips_count : item.submittedTo.length, 
							submitted_on : item.submittedOn, closed_on : item.qollstionnaireClosedOn, 
							tags : item.tags, topics  : item.topics && item.topics != null? item.topics : ["Unassigned"],
							byUser : item.byUser, fromSource : item.fromSource, onDate : item.onDate, closedOn : item.qollstionnaireClosedOn,
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

			var groups = user.groups;
			if(!groups) groups = [];

			var group_ids = [];
			groups.map(function(group){
				if(group.accessApproved === 'approved')
					group_ids.push(group.groupId);
			});

			qlog.info('Found user - ' + JSON.stringify(user), filename);

			var facebookQuestId = fetchUsersFacebookQuestionnaires(user._id);
			qlog.info('FACEBOOK Questionnaire ID: ' + facebookQuestId, filename);

			//handle_questionaires = Qollstionnaire.find({'submittedBy' : this.userId,'status' : QollConstants.STATUS.SENT})

			handle_questionaires = Qollstionnaire.find(
				{$or: [
						{ 'submittedTo' : UserUtil.getEmail(user), 'status' : QollConstants.STATUS.SENT }, 
						{ _id : {$in : facebookQuestId}},
						{ submittedToGroup : {$in : group_ids}}
					]
				},
				{ sort : { 'submittedOn' : -1}, reactive : true }
			).observe({
				added : function(item, idx){
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					length_class = item.anonymous_type && item.anonymous_type === QollConstants.QOLL_PORTAL.FACEBOOK ? 'facebook-qoll' : length_class;
					var pub = {_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
						recips_count : item.submittedTo?item.submittedTo.length:0, submitted_on : item.submittedOn, 
						closed_on : item.qollstionnaireClosedOn, length_class : length_class};
					
					var resp = QollstionnaireResponses.findOne({
						qollstionnaireid : item._id,
						usrid : user._id
					});

					if(resp) {
						pub.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						pub.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					var editorarr = Meteor.users.find({"_id" : item.submittedBy}).fetch();
					if (editorarr.length > 0) {
						var editor = editorarr[0];
						pub.createdBy = editor._id;
						pub.createdByEmail = editor.profile.email;
						pub.createdByName = editor.profile.name;
						pub.createdOn = item.submittedOn;
						pub.end_time = item.end_time;
					}

					self.added('recvd-questionaire', item._id, pub);
				},
				changed : function(item, idx) {
					var length_class = item.qollids.length == 1? 'single' : 'multiple';
					length_class = item.anonymous_type && item.anonymous_type === QollConstants.QOLL_PORTAL.FACEBOOK ? 'facebook-qoll' : length_class;
					var pub = {_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
						recips_count : item.submittedTo?item.submittedTo.length:0, submitted_on : item.submittedOn, 
						closed_on : item.qollstionnaireClosedOn, length_class : length_class};
					
					var resp = QollstionnaireResponses.findOne({
						qollstionnaireid : item._id,
						usrid : user._id
					});
					
					if(resp) {
						pub.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						pub.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					var editorarr = Meteor.users.find({"_id" : item.submittedBy}).fetch();
					if (editorarr.length > 0) {
						var editor = editorarr[0];
						pub.createdBy = editor._id;
						pub.createdByEmail = editor.profile.email;
						pub.createdByName = editor.profile.name;
						pub.createdOn = item.submittedOn;
						pub.end_time = item.end_time;
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
							recips_count : item.submittedTo?item.submittedTo.length:0, submitted_on : item.submittedOn, category : item.category,
							qollstionnaire_closed : item.qollstionnaireClosed, qollstionnaire_closed_on : item.qollstionnaireClosedOn,
							total_weight : item.total_weight};

					// check if the questionaire has ended and close it appropriately
					var dt_now = new Date();
					qlog.info("+++++++++++++++++++>>>>>1 dt_now is - " + dt_now + ", end_time is - " + item.end_time, filename);
					if(item.end_time && dt_now >= item.end_time && item.qollstionnaireClosed != 'closed'){
						qlog.info("+++++++++++++++++++>>>>>2 dt_now is - " + dt_now + ", end_time is - " + item.end_time, filename);
						QollstionnaireFns.close_questionnaire(item._id, 'qollops');
						questionaire.qollstionnaire_closed = 'closed';
						questionaire.qollstionnaire_closed_on = dt_now;

						if(resp) questionaire.total_weight_earned = resp.total_weight_earned;
					}


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

						if(resp.qollstionnaireSubmitted) questionaire.total_weight_earned = resp.total_weight_earned;
					}

					var editorarr = Meteor.users.find({"_id" : item.submittedBy}).fetch();
					if (editorarr.length > 0) {
						var editor = editorarr[0];
						questionaire.createdBy = editor._id;
						questionaire.createdByEmail = editor.profile.email;
						questionaire.createdByName = editor.profile.name;
						questionaire.createdOn = item.submittedOn;
						questionaire.end_time = item.end_time;
					}

					qlog.info('+++++++++++++++++> ' + JSON.stringify(questionaire), filename);

					self.added('questionaire-for-id', item._id, questionaire);
				},
				changed : function(item, idx) {
					var questionaire = {_id : item._id, title : item.title, tags : item.tags, qoll_count : item.qollids.length, 
							recips_count : item.submittedTo?item.submittedTo.length:0, submitted_on : item.submittedOn, category : item.category,
							qollstionnaire_closed : item.qollstionnaireClosed, qollstionnaire_closed_on : item.qollstionnaireClosedOn,
							total_weight : item.total_weight};

					

					// check if the questionaire has ended and close it appropriately
					var dt_now = new Date();
					if(item.end_time && dt_now >= item.end_time && item.qollstionnaireClosed != 'closed'){
						QollstionnaireFns.close_questionnaire(item._id, 'qollops');
						questionaire.qollstionnaire_closed = 'closed';
						questionaire.qollstionnaire_closed_on = dt_now;

						if(resp) questionaire.total_weight_earned = resp.total_weight_earned;
					}

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

						if(resp.qollstionnaireSubmitted) questionaire.total_weight_earned = resp.total_weight_earned;
					}

					var editorarr = Meteor.users.find({"_id" : item.submittedBy}).fetch();
					if (editorarr.length > 0) {
						var editor = editorarr[0];
						questionaire.createdBy = editor._id;
						questionaire.createdByEmail = editor.profile.email;
						questionaire.createdByName = editor.profile.name;
						questionaire.createdOn = item.submittedOn;
						questionaire.end_time = item.end_time;
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

	Meteor.publish('GROUPS_FOR_QUESTIONNAIRE_ID_PUBLISHER', function(findoptions) {
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
						// collect groups for this questionnaire
						var groups = new Array();
						var group_ids = item.submittedToGroup;
						qlog.info(group_ids, filename);
						if(group_ids.length > 0) {
							var groups_1 = Groups.fetchForQuery({_id : {$in : item.submittedToGroup}}).fetch();
							
							self.added('groups-for-questionaire-id', item._id+'_quest_id_groups', groups_1);
						}
					},
					changed : function(item, idx) {
						var groups = new Array();
						var group_ids = item.submittedToGroup;
						if(group_ids.length > 0) {
							var groups_1 = Groups.fetchForQuery({_id : {$in : item.submittedToGroup}}).fetch();
							
							self.changed('groups-for-questionaire-id', item._id+'_quest_id_groups', groups_1);
						}
					},
					removed : function(item){
						self.removed('groups-for-questionaire-id', item._id+'_quest_id_groups');
					}
				});
			}
		}

		qlog.info('Done initializing the qoll-for-questionaire-id: GROUPS_FOR_QUESTIONNAIRE_ID_PUBLISHER, uuid: ' + uuid, filename);
		initializing = false;
		self.ready();
		//self.flush();

		self.onStop(function() {
			if(handle_questionaires != undefined) {
				handle_questionaires.stop();
			}
		});
	});

	Meteor.publish('QUESTIONNAIRE_PUBLISHER_TO_ADD_SUBSCRIBERS', function(findoptions) {
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
							q2.idx = counter;
							q2.qoll_idx_title = '(Q'+counter+++')';
							q2.context = findoptions.context;

							q2.show_result = user._id === item.submittedBy || resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed';

							if(q2.show_result && response) q2.qoll_response = response;

							if(item.qoll_attributes)
								q2.qoll_attributes = item.qoll_attributes[t._id];

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							q2 = QollRandomizer.randomize(q2);

							// q2 = QollKatexUtil.populateIfTex(q2, t);

							//if submitted, do not let register any more answers
							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
								q2.context = QollConstants.CONTEXT.READ;
							} else {
								q2.explanation = undefined;
							}

							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed' || findoptions.context === QollConstants.CONTEXT.READ) {
								q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
							} else {
								q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
								/** q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
								q2.comments = filterCommentForWriteCtx(q2.comments, user.profile.email); **/
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {questTitle : item.title, questSize	: item.qollids.length, questId : item._id,
								 status : item.status, qollstionnaireClosed : item.qollstionnaireClosed, 
								 qollstionnaireClosedOn : item.qollstionnaireClosedOn, qollAttributes : item.qoll_attributes};

					if(resp && resp.qollstionnaireSubmitted == true) {
						quest.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						quest.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					if(user._id === item.submittedBy) {
						// send more information at the questionnaire level so that owner gets to see how people have responded
						quest.questSubmittedTo  = item.submittedTo;
						quest.questResponse = getQuestionnaireResponses(item);
					}

					// collect groups for this questionnaire
					var groups = new Array();
					var group_ids = item.submittedToGroup;
					qlog.info(group_ids, filename);
					if(group_ids.length > 0) {
						var groups_1 = Groups.fetchForQuery({_id : {$in : item.submittedToGroup}}).fetch();
						groups_1.forEach(function(grp){
							groups.push(grp);
						});
					}

					qlog.info('Pushing qolls to client ++++++++++++++++++> ' + JSON.stringify(quest), filename);

					var pub = {qolls : qolls, questionaire : quest, groups : groups};

					if(quest.questResponse || resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
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
							q2.idx = counter;
							q2.qoll_idx_title = '(Q'+counter+++')';
							q2.context = findoptions.context;
							
							q2.show_result = user._id === item.submittedBy || resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed';

							if(q2.show_result && response) q2.qoll_response = response;

							if(item.qoll_attributes)
								q2.qoll_attributes = item.qoll_attributes[t._id];

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							q2 = QollRandomizer.randomize(q2);

							// q2 = QollKatexUtil.populateIfTex(q2, t);

							//if submitted, do not let register any more answers
							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
								q2.context = QollConstants.CONTEXT.READ;
							} else {
								q2.explanation = undefined;
							}

							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed' || findoptions.context === QollConstants.CONTEXT.READ) {
								q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
							} else {
								q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
								/** q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
								q2.comments = filterCommentForWriteCtx(q2.comments, user.profile.email); **/
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {questTitle : item.title, questSize	: item.qollids.length, questId : item._id,
								 status : item.status, qollstionnaireClosed : item.qollstionnaireClosed, 
								 qollstionnaireClosedOn : item.qollstionnaireClosedOn, qollAttributes : item.qoll_attributes};

					if(resp && resp.qollstionnaireSubmitted == true) {
						quest.qollstionnaireSubmitted 	= resp.qollstionnaireSubmitted;
						quest.qollstionnaireSubmittedOn 	= resp.qollstionnaireSubmittedOn;
					}

					if(user._id === item.submittedBy) {
						// send more information at the questionnaire level so that owner gets to see how people have responded
						quest.questSubmittedTo  = item.submittedTo;
						quest.questResponse = getQuestionnaireResponses(item);
					}

					var groups = new Array();
					var group_ids = item.submittedToGroup;
					if(group_ids.length > 0) {
						groups.concat(Groups.fetchForQuery({_id : {$in : item.submittedToGroup}}).fetch());
					}

					var pub = {qolls : qolls, questionaire : quest, groups : groups};

					if(quest.questResponse || resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
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

	qlog.info('Done initializing the qoll-for-questionaire-id: QUESTIONNAIRE_PUBLISHER_TO_ADD_SUBSCRIBERS, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_questionaires != undefined) {
			handle_questionaires.stop();
		}
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
							q2.idx = counter;
							q2.qoll_idx_title = '(Q'+counter+++')';
							q2.context = findoptions.context;

							q2.show_result = user._id === item.submittedBy || resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed';

							if(q2.show_result && response) q2.qoll_response = response;

							if(item.qoll_attributes)
								q2.qoll_attributes = item.qoll_attributes[t._id];

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							q2 = QollRandomizer.randomize(q2);

							// q2 = QollKatexUtil.populateIfTex(q2, t);

							//if submitted, do not let register any more answers
							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
								q2.context = QollConstants.CONTEXT.READ;
							} else {
								q2.explanation = undefined;
							}

							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed' || findoptions.context === QollConstants.CONTEXT.READ) {
								q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
							} else {
								q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
								/** q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
								q2.comments = filterCommentForWriteCtx(q2.comments, user.profile.email); **/
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {questTitle : item.title, questSize	: item.qollids.length, questId : item._id,
								 status : item.status, qollstionnaireClosed : item.qollstionnaireClosed, 
								 qollstionnaireClosedOn : item.qollstionnaireClosedOn, qollAttributes : item.qoll_attributes};

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

					if(quest.questResponse || resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
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
							q2.idx = counter;
							q2.qoll_idx_title = '(Q'+counter+++')';
							q2.context = findoptions.context;
							
							q2.show_result = user._id === item.submittedBy || resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed';

							if(q2.show_result && response) q2.qoll_response = response;

							if(item.qoll_attributes)
								q2.qoll_attributes = item.qoll_attributes[t._id];

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							q2 = QollRandomizer.randomize(q2);

							// q2 = QollKatexUtil.populateIfTex(q2, t);

							//if submitted, do not let register any more answers
							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
								q2.context = QollConstants.CONTEXT.READ;
							} else {
								q2.explanation = undefined;
							}

							if(resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed' || findoptions.context === QollConstants.CONTEXT.READ) {
								q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
							} else {
								q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
								/** q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];
								q2.comments = filterCommentForWriteCtx(q2.comments, user.profile.email); **/
							}

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {questTitle : item.title, questSize	: item.qollids.length, questId : item._id,
								 status : item.status, qollstionnaireClosed : item.qollstionnaireClosed, 
								 qollstionnaireClosedOn : item.qollstionnaireClosedOn, qollAttributes : item.qoll_attributes};

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

					if(quest.questResponse || resp && resp.qollstionnaireSubmitted == true || item.qollstionnaireClosed === 'closed') {
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
							q2.end_time = item.end_time;

							// q2 = QollKatexUtil.populateIfTex(q2, t);

							// For quicker, show all the comments all the time
							q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							// if time between response submission and now is more than 30 seconds, show explanation
							var now = new Date();
							var responseTime = resp && resp.responses[qid] && resp.responses[qid].submittedOn? resp.responses[qid].submittedOn : now;
							var timeLapse = (now.getTime() - responseTime.getTime())/1000;
							qlog.info('TTTTTTTTTime lapse => ' + timeLapse, filename);
							if(timeLapse < 30) {
								// do not show the answer yet
								q2.explanation = undefined;
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
							var responseTime = resp && resp.responses[qid] && resp.responses[qid].submittedOn? resp.responses[qid].submittedOn : now;
							var response = resp && resp.responses[qid] ? resp.responses[qid] : undefined;
							
							var q2 = extractQollDetails(t);
							q2.myresponses = thisresponse;
							q2._qollstionnaireid = item._id;
							q2.status = item.status;
							q2.action = item.status;
							q2.qoll_idx_title = '(Q).';
							q2.context = findoptions.context;
							q2.qoll_response = response;
							q2.end_time = item.end_time;

							// q2 = QollKatexUtil.populateIfTex(q2, t);

							// For quicker, show all the comments all the time
							q2.comments = item.qolls_to_comments? item.qolls_to_comments[qid] : [];

							if(findoptions.context === QollConstants.CONTEXT.WRITE) {
								if(response != undefined)
									q2.fib = response.response;
								else q2.fib = [];
							}

							// if time between response submission and now is more than 30 seconds, show explanation
							var now = new Date();
							var responseTime = thisresponse && thisresponse.qollstionnaireSubmittedOn? thisresponse.qollstionnaireSubmittedOn : now;
							var timeLapse = (now.getTime() - responseTime.getTime())/1000;
							if(timeLapse < 30) {
								// do not show the answer yet
								q2.explanation = undefined;
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
		if(handle_quicker) handle_quicker.stop();
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
	qlog.info("===================================+++++=======> " + JSON.stringify(findoptions), filename);
	var tuid = findoptions.userId; // this.userId ? this.userId : findoptions.userId;
	var ufound = Meteor.users.find({ "_id" : tuid }).fetch();

	// var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
	var user = ufound[0];
	var groups = QollGroups.find({'userEmails' : UserUtil.getEmail(user)})
	var grps = [];
	groups.map(function(gr){
		grps.push(gr.groupName);
	});

	qlog.info('Pushed groups before making the query =============>>>> ' + grps + '/' + tuid + '/' + findoptions.share_circle, filename);

	var query_array = [];

	var share_circle = findoptions.share_circle;
	var share_circle_query = '';
	if(share_circle && share_circle.length > 0) {
		// add the query to compare the two arrays here
		// query_array.push({'share_circle' : share_circle});
		query_array.push({ share_circle: { $all: share_circle } });
	}

	var query = '';
	if(findoptions && findoptions.topics && findoptions.topics != '') {
		topic_query = ", topics: { $all: "+ findoptions.topics +" }";

		query_array.push({'submittedBy' : user._id,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}, 
							topics : {$all : findoptions.topics}}, 
						{'visibility': QollConstants.QOLL.VISIBILITY.PUB,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE},
							topics : {$all : findoptions.topics}},
						{'visibility': QollConstants.QOLL.VISIBILITY.PVT,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE},
							accessToGroups : {$in : grps}, topics : {$all : findoptions.topics}});

		query = {$or: query_array};
	} else {
		query_array.push({'submittedBy' : user._id,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}}, 
						{'visibility': QollConstants.QOLL.VISIBILITY.PUB,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}},
						{'visibility': QollConstants.QOLL.VISIBILITY.PVT,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE},
							accessToGroups : {$in : grps}});
		query = {$or: query_array };
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
		tex 			: q.tex,
		texMode			: q.texMode? q.texMode : QollConstants.TEX_MODE.MATHJAX,
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
		qollRawId 		: q.qollRawId,
		explanation		: q.explanation,
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
		qoll_text_hash[qid] = {qollText : t.qollText, title : t.title, qollCat : t.cat, fib: t.fib, tex: t.tex};
	});

	item.submittedTo.map(function(subTo){
		//var u1 = Meteor.users.find({'emails.address' : subTo}).fetch();
		var u1 = Meteor.users.find({'profile.email' : subTo}).fetch();
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

		//qlog.info('Print resp ---------------->>>>>> ' + item._id + '/' + subTo + '/' + JSON.stringify(resp), filename);

		var counter_x = 1;
		item.qollids.map(function(qid){
			if(resp && resp.responses[qid]) {
				var cnt1 = 0;
				var attach_resp = [];
				var rtmp = resp.responses[qid];
				
				if(rtmp.type.toLowerCase() === QollConstants.QOLL_TYPE.MULTI || rtmp.type === QollConstants.QOLL.TYPE.SINGLE) {
					rtmp.response.map(function(tmp){
						//qlog.info('Printing response ------------>>>>>> ' + tmp + '////' + rtmp.type);
						
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
								title : qoll_text_hash[qid].title, qoll_id : qid, cat : qoll_text_hash[qid].qollCat,
								fib : qoll_text_hash[qid].fib, tex : qoll_text_hash[qid].tex, weight_earned : rtmp.weight_earned,
								hint_penalty : rtmp.hint_penalty
							});

				if(!resp_flag) {
					respo_length++;
					resp_flag = true;
				}

			} else {
				responses.push({
								'response' : 'NA', 'unit_selected' : undefined, label : 'Q' + counter_x++, responses : [],
								name : name, email : subTo, qollText : qoll_text_hash[qid].qollText,
								title : qoll_text_hash[qid].title, qoll_id : qid, cat : qoll_text_hash[qid].qollCat,
								fib : qoll_text_hash[qid].fib, tex : qoll_text_hash[qid].tex
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

var filterCommentForWriteCtx= function(comments, this_email_id) {
	var filtered_comments = new Array();

	if(comments != undefined)
	comments.map(function(comment){
		if(comment.owner_comment === true) {
			filtered_comments.push(comment);
		} else if(comment.email_id === this_email_id) {
			filtered_comments.push(comment);
		}
	});

	return filtered_comments;
};

var fetchUsersFacebookQuestionnaires = function(userid) {
	var facebookQuestId = new Array();

	QollstionnaireResponses.find({usrid : userid, qollPortal : 'facebook'}).map(function(qr){
		facebookQuestId.push(qr.qollstionnaireid);
	});

	return facebookQuestId;
};

var populateAuthorMetaData = function(item, tuid) {
	if(item.submittedBy != tuid) {
		var sharecircle_u = Meteor.users.find({"_id" : item.submittedBy}).fetch();
		if (sharecircle_u.length > 0) {
			item.byUser = sharecircle_u[0].profile.name;
			item.fromSource = item.share_circle ? item.share_circle[0] : '---';
		} else {
			item.byUser = 'Anonymous';
			item.fromSource = '---';
		}
	} else {
		item.byUser = 'Self';
		item.fromSource = 'Self';
	}

	item.onDate = item.submittedOn;

	return item;
}

