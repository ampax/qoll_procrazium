var filename="server/publish/ExtQollPublisher.js";

Meteor.publish('EXT_QUESTIONAIRE_PUBLISHER', function(findoptions) {
	// var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_questionaires;
	var extUserEmailId = findoptions.user_email_id;
	var userQUUID = findoptions.user_q_uuid;

	var user=Meteor.users.findOne({ "profile.email" : extUserEmailId });
    if(!user) {
        user=Meteor.users.findOne({ "emails.address" : extUserEmailId });
    }

    var q = Qolls.QollstionnaireDb.get({_id : findoptions._id});

    //if(q.submittedToUUID && q.submittedToUUID[CoreUtils.encodeEmail(extUserEmailId)] !== userQUUID) q = undefined;
    
    qlog.info('Found questionnaire +++++++++++=====> ' + JSON.stringify(q), filename);

    if(user) qlog.info('Fetched user with email - ' + extUserEmailId + ' ::: ' + JSON.stringify(user), filename);
	if (q) {
		//Check for existing user record
			var resp = undefined;
			if (user) {
				resp = QollstionnaireResponses.findOne({
					qollstionnaireid : findoptions._id,
					usrid : user._id
				});
			} else {
				resp = QollstionnaireResponses.findOne({
					qollstionnaireid : findoptions._id,
					ext_id : extUserEmailId
				});
			}
			
			qlog.info('Find questionnaire for id : ' + findoptions._id, filename);
			handle_questionaires = Qollstionnaire.find({'_id' : findoptions._id}).observe({
				added : function(item, idx){
					qlog.info('1=1=1=1=1=1=1==>'+JSON.stringify(item), filename);
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

							qlog.info('Pushing qolls to client 2=2=2=2=2=2=2=2=> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {title : item.title, qoll_count	: item.qollids.length};

					qlog.info('Pushing qolls to client 3=3=3=3=3=3=3=3=3=> ' + JSON.stringify(qolls), filename);

					qlog.info('Questionnaire detail - ' + JSON.stringify(quest), filename);

					self.added('ext-qoll-for-questionaire-id', item._id, {qolls : qolls, questionaire : quest});
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

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {title : item.title, qoll_count	: item.qollids.length};

					//qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(qolls), filename);

					self.changed('ext-qoll-for-questionaire-id', item._id, {qolls : qolls, questionaire : quest});
				},
				removed : function(item){
					self.removed('ext-qoll-for-questionaire-id', item._id);
				}
			});
		//}
	}

	qlog.info('Done initializing the ext-qoll-for-questionaire-id: EXT_QUESTIONAIRE_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_questionaires != undefined) handle_questionaires.stop();
	});
});


Meteor.publish('EXT_EMBEDDED_QUESTIONAIRE_PUBLISHER', function(findoptions) {
	// var user_id = this.userId;
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var handle_questionaires;
	var extUserEmailId = findoptions.user_email_id;

	var user=Meteor.users.findOne({ "profile.email" : extUserEmailId });
    if(!user) {
        user=Meteor.users.findOne({ "emails.address" : extUserEmailId });
    }

    var q = Qolls.QollstionnaireDb.get({_id : findoptions._id});

    if(q && q.submittedToUUID && !q.submittedToUUID[CoreUtils.encodeEmail(extUserEmailId)]) {
    	// update the questionnaire for UUID
    	var quuid = q.submittedToUUID;
		
		if(!quuid) quuid = {};
		
		quuid[CoreUtils.encodeEmail(extUserEmailId)] = CoreUtils.generateUUID();

    	Qolls.QollstionnaireDb.update({_id : findoptions._id}, { submittedToUUID : quuid });
    }
    // submittedToUUID[CoreUtils.encodeEmail(extUserEmailId)] : userQUUID

    qlog.info('Found questionnaire =====> ' + JSON.stringify(q), filename);

    if(user) qlog.info('Fetched user with email - ' + extUserEmailId + ' ::: ' + JSON.stringify(user), filename);
	if (q) {
		//Check for existing user record
			var resp = undefined;
			if (user) {
				resp = QollstionnaireResponses.findOne({
					qollstionnaireid : findoptions._id,
					usrid : user._id
				});
			} else {
				resp = QollstionnaireResponses.findOne({
					qollstionnaireid : findoptions._id,
					ext_id : extUserEmailId
				});
			}
			
			qlog.info('Find questionnaire for id : ' + findoptions._id, filename);
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

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {title : item.title, qoll_count	: item.qollids.length};

					//qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(qolls), filename);

					qlog.info('Questionnaire detail - ' + JSON.stringify(quest), filename);

					self.added('ext-qoll-embed-questionaire-id', item._id, {qolls : qolls, questionaire : quest});
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

							qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(q2.fib), filename);

							qolls.push(q2);
						});
					});

					var quest = {title : item.title, qoll_count	: item.qollids.length};

					//qlog.info('Pushing qolls to client ---------------> ' + JSON.stringify(qolls), filename);

					self.changed('ext-qoll-embed-questionaire-id', item._id, {qolls : qolls, questionaire : quest});
				},
				removed : function(item){
					self.removed('ext-qoll-embed-questionaire-id', item._id);
				}
			});
		//}
	}

	qlog.info('Done initializing the ext-qoll-embed-questionaire-id: EXT_EMBEDDED_QUESTIONAIRE_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		if(handle_questionaires != undefined) handle_questionaires.stop();
	});
});

var translateToIndexedArray = function ( ar){
		if(!ar) return [];
		return ar.map(function (item,ix){ return {index : ix, value : item};});
};

var extractQollDetails = function(q) {
	return {
		qollTitle 		: q.title,
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
		//enableEdit 		: q.action === 'store',
		stats 			: q.stats,
		//viewContext 	: "createUsr",
		isMultiple		: q.isMultiple,
		imageIds		: q.imageIds,
		_id 			: q._id,
		qollRawId 		: q.qollRawId
	};
};
