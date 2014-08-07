var filename = 'server/db/QollDb.js';

QollTimerAction = new Meteor.Collection("QOLL_TIMER_ACTION");
/** Database insert method for qolls  **/
Meteor.methods({
	addQoll : function(qollText, qollType) {
		qlog.info("BAD Add qoll: " + qollText, filename);
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
	
	addQoll : function(action, qollText, qollTypes, qollTypesX, isMultiple, qollRawId, qollMasterId, emails, isparent, parentid, tags, attributes, qollStarAttributes, qollAttributes, qollFormat) {
		qlog.info("GOOD Add qoll: " + qollText, filename);
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
		var collection_forqoll = Qoll;
		if (actualmails.length == 1 && actualmails[0] == 'qbank@qoll.io') {
			collection_forqoll = QBank;
		}
		var qoll_to_insert = {
			'action' : action,
			'qollText' : qollText,
			'isMultiple' : isMultiple,
			'qollTypes' : qollTypes,
			'qollTypesX' : qollTypesX,
			'qollStarAttributes' : qollStarAttributes,
			'qollAttributes' : qollAttributes,
			'stats' : newQtype,
			'submittedToGroup' : actualgroups,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'submittedTo' : actualmails,
			'qollRawId' : qollRawId,
			'qollMasterId' : qollMasterId,
			'tags' : tags,
			'attributes' : attributes,
			'qollFormat' : qollFormat
		};
		if (isparent) {
			qoll_to_insert.is_parent = true;
		}
		if (parentid) {
			qoll_to_insert.parentId = parentid;
		}
		var qollId = collection_forqoll.insert(qoll_to_insert);

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
	addQollMaster : function(qollText, emailsandgroups, tags, action) {
		qlog.info('Inserting into qoll master', filename);
		var visibility = QollConstants.QOLL.VISIBILITY.PUB; //send this from the front end once we have it there
		/**var qollMasterId = QollMaster.insert({
			'qollText' : qollText,
			'tags' : tags,
			'submittedOn' : new Date(),
			'updatedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'visibility' : visibility
		});**/

		//Store the tags
		var err_msg = QollTagsDb.storeTags(tags);
		qlog.info('Printing tags return results - ' + err_msg, filename);

		var qollMasterId = Qolls.QollMasterDb.insert({'qollText' : qollText, 'tags' : tags, 'visibility' : visibility, 'qollFormat' : QollConstants.QOLL.FORMAT.TXT});

		var qollIds = QollParser.addQollsForMaster(qollText, qollMasterId, emailsandgroups, tags, action, visibility, QollConstants.QOLL.FORMAT.TXT);

		return qollMasterId;
	},

	processStoreHtmlQoll : function(html, emailsandgroups, tags, action, visibility){
		var md = ToMarkdown.convert(html);

		md = md.replace(/(\d+)\.\s+/g, '- ');

		md = md.replace(/\*\s+/g, '- ');

		/** Testing the qoll functions here **/
		QollParserTest.parseHtml(md);

		var err_msg = QollTagsDb.storeTags(tags);

		var masterId = Qolls.QollMasterDb.insert({'qollText' : md, 'tags' : tags, 'visibility' : visibility, 'qollFormat' : QollConstants.QOLL.FORMAT.HTML});

		var qollIds = QollParser.addQollsForMaster(md, masterId, emailsandgroups, tags, action, visibility, QollConstants.QOLL.FORMAT.HTML);

		qlog.info('Persisting the html into database - ' + md + ', emailsandgroups - ' + emailsandgroups 
			+ ', tags - ' + tags + ', action - ' + action + ', visibility - ' + visibility + ', master_id - '
			+ masterId + ', qollIds - ' + qollIds, filename);

		return 'Successfully stored the html qoll';
	}
});

/**var addQollRaw = function(qollText, qollMasterId, tags, visibility) {
	var qollRawId = QollRaw.insert({
		'qollText' : qollText,
		'qollMasterId' : qollMasterId,
		'tags' : tags,
		'submittedOn' : new Date(),
		'submittedBy' : Meteor.userId(),
		'submittedByEmail' : getCurrentEmail,
		'visibility' : visibility
	});
	return qollRawId;
};**/
