var filename = 'server/db/QollDb.js';

QollTimerAction = new Meteor.Collection("QOLL_TIMER_ACTION");
/** Database insert method for qolls  **/
Meteor.methods({
	getRawQoll: function(qollrawid){
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
	
	addQoll : function(action, qollText, qollTypes, qollTypesX, isMultiple, qollRawId, qollMasterId, emails, isparent, parentid, tags, attributes, qollStarAttributes, qollAttributes, qollFormat,qollIdtoUpdate) {
		/** Moved to questionnaire **
		var newQtype = {};
		var i = 0, actualmails = [], actualgroups = [];

		for ( i = 0; i < (emails || []).length; i++) {
			if (emails[i].indexOf('@') > -1) {
				actualmails.push(emails[i]);
			} else {
				actualgroups.push(emails[i]);
			}
		}
		
		var qollTypeIx = 0;
		var stats = qollTypes.map(function(qtype) {
			newQtype[qollTypeIx + ''] = 0;
			qollTypeIx += 1;
		});
		**/

		var collection_forqoll = Qoll; //Probably not required but keeping it for now
		/** Moved to questionnaire **
		if (actualmails.length == 1 && actualmails[0] == 'qbank@qoll.io') {
			collection_forqoll = QBank;
		}
		**/
		var qoll_to_insert = {
			'action' : action,
			'qollText' : qollText,
			'isMultiple' : isMultiple,
			'qollTypes' : qollTypes,
			'qollTypesX' : qollTypesX,
			'qollStarAttributes' : qollStarAttributes,
			'qollAttributes' : qollAttributes,
			//'stats' : newQtype, /** Stats at qoll level will be thought later **/
			//'submittedToGroup' : actualgroups, /** Moved to questionnaire **/
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			//'submittedTo' : actualmails, /** Moved to questionnaire **/
			'qollRawId' : qollRawId,
			'qollMasterId' : qollMasterId,
			'tags' : tags,
			'attributes' : attributes,
			'qollFormat' : qollFormat
		};
		/** Removing the circular relationship **
		if (isparent) {
			qoll_to_insert.is_parent = true;
		}
		if (parentid) {
			qoll_to_insert.parentId = parentid;
		}
		**/
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
	addQollMaster : function(qollText, emailsandgroups, tags, action, visibility, qollIdtoUpdate) {
		qlog.info('Inserting into qoll master', filename);

		//Store the tags
		var err_msg = QollTagsDb.storeTags(tags);

		var masterId = Qolls.QollMasterDb.insert({'qollText' : qollText, 'tags' : tags, 'visibility' : visibility, 'qollFormat' : QollConstants.QOLL.FORMAT.TXT});

		var qollids = QollParser.addQollsForMaster(qollText, masterId, emailsandgroups, tags, action, visibility, QollConstants.QOLL.FORMAT.TXT, qollIdtoUpdate);

		var questinfo = addQuestionaire(emailsandgroups, qollids, visibility, tags, action);

		return 'Successfully created ' + qollids.length + ' qolls.' + questinfo;
	},

	processStoreHtmlQoll : function(html, emailsandgroups, tags, action, visibility, qollIdToUpdate){
		var md = ToMarkdown.convert(html);

		md = md.replace(/(\d+)\.\s+/g, '- ');

		md = md.replace(/\*\s+/g, '- ');

		/** Testing the qoll functions here **/
		//QollParserTest.parseHtml(md);
		//QollParser.parseHtml(md);
		//return;

		var err_msg = QollTagsDb.storeTags(tags);

		var masterId = Qolls.QollMasterDb.insert({'qollText' : md, 'tags' : tags, 'visibility' : visibility, 'qollFormat' : QollConstants.QOLL.FORMAT.HTML});

		var qollids = QollParser.addQollsForMaster(md, masterId, emailsandgroups, tags, action, visibility, QollConstants.QOLL.FORMAT.HTML, qollIdToUpdate);

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
