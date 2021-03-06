var filename = 'server/db/QollDb.js';

QollTimerAction = new Meteor.Collection("QOLL_TIMER_ACTION");
/** Database insert method for qolls  **/
Meteor.methods({
	getRawQoll: function(qollrawid){
		qlog.info('Finding raw-qoll for the qollrawid: ' + qollrawid, filename);
		var rawqo= QollRaw.findOne({_id:qollrawid});
		return rawqo;
	},
	addQoll : function(qollText, qollType) {
		//qlog.info("BAD Add qoll: " + qollText, filename);
		var qollId = Qoll.insert({
			'qollText' : qollText,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'submittedTo' : [],
			'qollType' : qollType
		});

		return qollId;
	},
	
	/**
	* Qoll Data will have the following attributes in the end
	* qollData = ( QollConstants.EDU.FIB, QollConstants.EDU.CAT, QollConstants.EDU.TITLE, QollConstants.EDU.TEXT, QollConstants.EDU.FIB,
	*						QollConstants.EDU.ANSWER, QollConstants.EDU.HINT, QollConstants.EDU.UNIT_NAME, QollConstants.EDU.UNITS,
	*						types, typesX, visibility, complexity, isMultiple ) 
	**/
	//qollText, qollTypes, qollTypesX, isMultiple, attributes, qollStarAttributes, qollAttributes, 
	addQoll : function(action, qollData, qollRawId, qollMasterId, emails, isparent, parentid, tags, qollFormat, qollIdtoUpdate, accessGroups) {
		var collection_forqoll = Qoll; 

		var qoll_to_insert = {
			'action' : action,
			'title' : qollData[QollConstants.EDU.TITLE],
			'qollText' : qollData[QollConstants.EDU.TEXT],
			'cat' : qollData[QollConstants.EDU.CAT],
			'answer' : qollData[QollConstants.EDU.ANSWER],
			'fib' : qollData[QollConstants.EDU.FIB],
			'tex' : qollData[QollConstants.EDU.TEX],
			'hint' : qollData[QollConstants.EDU.HINT],
			'unit_name' : qollData[QollConstants.EDU.UNIT_NAME],
			'unit' : qollData[QollConstants.EDU.UNITS],
			//'qollText' : qollText,
			'isMultiple' : qollData.isMultiple,
			'qollTypes' : qollData.types,
			'qollTypesX' : qollData.typesX,
			'visibility' : qollData.visibility,
			'complexity' : qollData.complexity,
			'accessToGroups' : accessGroups,
			//'qollStarAttributes' : qollStarAttributes,
			//'qollAttributes' : qollAttributes,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'qollRawId' : qollRawId,
			'qollMasterId' : qollMasterId,
			'tags' : tags,
			//'attributes' : attributes,
			'qollFormat' : qollFormat
		};

		var qollId;
		if(!qollIdtoUpdate){
			qlog.info('ABOUT to insert with updateid - ' + qollIdtoUpdate, filename);
			qollId = collection_forqoll.insert(qoll_to_insert);
		}
		else{
			qlog.info('ABOUT to inplace edit qoll with id - ' + qollIdtoUpdate, filename);
			qoll_to_insert._id=qollIdtoUpdate;
			qollId =qollIdtoUpdate;
			collection_forqoll.update(qollIdtoUpdate,qoll_to_insert,{upsert:false},function(err,obj){
				if(err)
					qlog.info('recieved error - ' + err, filename);
				if(!err){
					qlog.info('SUCCESS inplace edit qoll with id - ' + obj._id, filename);
				}
			});
		}

		return qollId;
	},
	modifyQollId : function(qollId, newAction) {
		var userId = Meteor.userId();
		if (userId) {
			var ufound = Meteor.users.find({
				"_id" : this.userId
			}).fetch();
			if (ufound.length > 0) {
				var user = ufound[0];
				//step 1.1 verify qoll's group/user is valid for this user
				var qollFound = Qoll.find({'_id':qollId}).fetch()[0];
				var canModify = false;
				qlog.info('checking ' + UserUtil.getEmail(user), filename);
				if (qollFound.submittedBy === userId) {
					canModify = true;

					Qoll.update({
						'_id' : qollId
					}, {
						$set : {
							action : newAction,
							submittedOn : new Date()
						}
					});
					Qoll.update({
						'parentId' : qollId
					}, {
						$set : {
							action : newAction,
							submittedOn : new Date()
						}
					}, {
						multi : true
					});
				}
			}

		}
	},
	updateQoll : function(qollText, qollTypes, emails, qollId) {
		var userId = Meteor.userId();
		var i = 0, actualmails = [], actualgroups = [];

		for ( i = 0; i < (emails || []).length; i++) {
			if (emails[i].indexOf('@') > -1) {
				actualmails.push(emails[i]);
			} else {
				actualgroups.push(emails[i]);
			}
		}

		if (userId && qollId) {
			Qoll.update({
				'_id' : qollId
			}, {
				$set : {
					qollText : qollText,
					qollTypes : qollTypes,
					submittedTo : actualmails,
					updatedOn : new Date()
				}
			});
			qlog.info('Qoll updated with id: ' + qollId, filename);
			return qollId;
		}
	},
	addQollstionnaire1 : function(qollstionnaire) {
		var emails = qollstionnaire.emails;
		var qbankids = qollstionnaire.qbank_qollids;
		var qtext = qollstionnaire.title;
		qlog.info('<=========' + qbankids + '=========>', filename);
		// step1 add a qoll that is parent
		var parentid = Meteor.call('addQoll', 'store', qtext, [], [], false, undefined, undefined, emails, true);
		//function(action, qollText, qollTypes, qollTypesX, isMultiple, qollRawId, qollMasterId, emails,isparent,parentid)
		qbankids.forEach(function(qbid) {
			var qbitem = QBank.findOne(qbid);
			Meteor.call('addQoll', 'store', qbitem.qollText, qbitem.qollTypes, qbitem.qollTypesX, qbitem.isMultiple, qbitem.qollRawId, qbitem.qollMasterId, emails, false, parentid, qbitem.qollStarAttributes, qbitem.qollAttributes);
		});
		return parentid;
	},
	addTimerAction : function(qollid, action_date, action_string) {
		var action_to_insert = {
			'qollId' : qollid,
			'actionDate' : action_date,
			'actionString' : action_string,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId()

		};
		return QollTimerAction.insert(action_to_insert);
	}
});

/** New Set of methods tomanage qolls from new qoll-editor **/
Meteor.methods({
	addQollMaster : function(qollText, emailsandgroups, tags, action, visibility, qollIdtoUpdate, accessGroups) {
		qlog.info('Inserting into qoll master', filename);

		//Store the tags
		if(tags != undefined)
			var err_msg = QollTagsDb.storeTags(tags);

		qlog.info('This is the editor content - ' + qollText, filename);

		var masterId = Qolls.QollMasterDb.insert({'qollText' : qollText, 'tags' : tags, 'visibility' : visibility, 'qollFormat' : QollConstants.QOLL.FORMAT.TXT});

		var qollids = QollParser.addQollsForMaster(qollText, masterId, emailsandgroups, tags, action, visibility, QollConstants.QOLL.FORMAT.TXT, qollIdtoUpdate, accessGroups);

		var questinfo = addQuestionaire(emailsandgroups, qollids, visibility, tags, action);

		return 'Successfully created ' + qollids.length + ' qolls.' + questinfo;
	},

	processStoreHtmlQoll : function(html, emailsandgroups, tags, action, visibility, qollIdToUpdate, accessGroups){
		//md = md.replace(/(\d+)\.\s+/g, '- ');//needs to be removed

		//md = md.replace(/\*\s+/g, '- ');//needs to be removed

		var md = html;

		qlog.info('Printing markdown text --------------------------------- ', filename);
		qlog.info(md, filename);

		//return;

		if(tags != undefined) 
			var err_msg = QollTagsDb.storeTags(tags);

		var masterId = Qolls.QollMasterDb.insert({'qollText' : md, 'tags' : tags, 'visibility' : visibility, 'qollFormat' : QollConstants.QOLL.FORMAT.HTML});
		
		var qollids = QollParser.addQollsForMaster(md, masterId, emailsandgroups, tags, action, visibility, QollConstants.QOLL.FORMAT.HTML, qollIdToUpdate, accessGroups);

		var questinfo = addQuestionaire(emailsandgroups, qollids, visibility, tags, action);
		
		return 'Successfully created ' + qollids.length + ' qolls.' + questinfo;
	}
});

var addQuestionaire = function(emailsandgroups, qollids, visibility, tags, action) {
	/**
		- store and send will both populate the Qoll table record
		- store 
			(1) Emails entered
				(i)   Save the qoll in the Qoll table
				(ii)  Create a new Questionnaire with status = draft
				(iii) If it is a single qoll, set the mode single, if multiple, set the mode questionnaire
			(2) Emails not entered (intention is to store the qolls and no questionnaire created)
				(i) Save the qoll in the Qoll table, no questionnaire created

		- send
			(1) Emails entered
				(i)   Save the qoll in the Qoll table
				(ii)  Create new questionnaire with status = sent
				(iii) If it is a single qoll, set the mode single, if multiple, set the mode questionnaire
	**/
	var questId = undefined, questinfo = '';
	if(emailsandgroups && emailsandgroups.length > 0) {

		var qollstionnaire = {};
		qollstionnaire.qollids = qollids;
		qollstionnaire.visibility = visibility;

		var eandg = QollParser.parseEmailAndGroups(emailsandgroups);
		qollstionnaire.submittedTo = eandg.submittedTo;
		qollstionnaire.submittedToGroup = eandg.submittedToGroup;

		qollstionnaire.tags = tags;

		qollstionnaire.qolls_to_email = QollParser.mapQollsToEmail(eandg.submittedTo, qollids);

		qollstionnaire.title = 'Questionnaire for ' + tags.join(', ') + '.';


		if(action === QollConstants.QOLL_ACTION_STORE) {
			qollstionnaire.status = QollConstants.STATUS.DRAFT;
		} else if(action === QollConstants.QOLL_ACTION_SEND) {
			qollstionnaire.status = QollConstants.STATUS.SENT;
		}

		questId = Qolls.QollstionnaireDb.insert(qollstionnaire);
		questinfo = ' Questionnaire with id - ' + questId;
	}
	return questinfo;
};
