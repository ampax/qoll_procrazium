var filename = 'server/db/QollDb.js';

Qoll = new Meteor.Collection("QOLL");

QollMaster = new Meteor.Collection("QOLL_MASTER");
QBank = new Meteor.Collection("QOLL_BANK");
QollRaw = new Meteor.Collection("QOLL_RAW");

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

	addQoll : function(action, qollText, qollTypes, qollTypesX, isMultiple, qollRawId, qollMasterId, emails, isparent, parentid) {
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
			'stats' : newQtype,
			'submittedToGroup' : actualgroups,
			'submittedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'submittedTo' : actualmails,
			'qollRawId' : qollRawId,
			'qollMasterId' : qollMasterId
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
				qlog.info('checking ' + user.emails[0].address, filename);
				if (qollFound.submittedBy === userId) {
					canModify = true;
				}
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
	addQollstionnaire : function(qollstionnaire) {
		var emails = qollstionnaire.emails;
		var qbankids = qollstionnaire.qbank_qollids;
		var qtext = qollstionnaire.title;
		// step1 add a qoll that is parent
		var parentid = Meteor.call('addQoll', 'store', qtext, [], [], false, undefined, undefined, emails, true);
		//function(action, qollText, qollTypes, qollTypesX, isMultiple, qollRawId, qollMasterId, emails,isparent,parentid)
		qbankids.forEach(function(qbid) {
			var qbitem = QBank.findOne(qbid);
			Meteor.call('addQoll', 'store', qbitem.qollText, qbitem.qollTypes, qbitem.qollTypesX, qbitem.isMultiple, qbitem.qollRawId, qbitem.qollMasterId, emails, false, parentid);
		});
		return parentid;
	}
});

/** New Set of methods tomanage qolls from new qoll-editor **/
Meteor.methods({
	addQollMaster : function(qollText, emailsandgroups, action) {
		qlog.info('Inserting into qoll master', filename);
		var qollMasterId = QollMaster.insert({
			'qollText' : qollText,
			'submittedOn' : new Date(),
			'updatedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,

		});

		addQollsForMaster(qollText, qollMasterId, emailsandgroups, action);

		return qollMasterId;
	},
});

/** Helper method for storing qolls for master-qoll-id **/
var addQollsForMaster = function(qollMaster, qollMasterId, emailsandgroups, action) {
        var regExAnser = /^(a)\s+/;
        var regExNoAnser = /^\s+/;
        var qollId = new Array();
        var qolls = qollMaster.split(/\#\s/); //qolls are seperated by \n#Qoll\s - changed to \n#\s
        qolls = qolls.slice(1);
        qolls.map(function(q){
            var qollRawId = addQollRaw(q, qollMasterId);
            var qs = q.split(/\n-/);
            var qoll = qs[0];
            qoll = DownTown.downtown(qoll, DownTownOptions.downtown_default());

            var count =0;
            var types = new Array();
            var typesX = new Array();
            var isMultiple = false;
            qs.slice(1).map(function(type){
                var x = {};
                type = type.trim();
                if(type.indexOf('(a) ') == 0) {
                    type = type.replace('(a) ', '');
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.type = type;
                    x.isCorrect = 1;
                    count++;
                } else {
                    type = DownTown.downtown(type, DownTownOptions.downtown_default());
                    x.type = type;
                    x.isCorrect = 0;
                }

                types.push(type);
                typesX.push(x);
            });
            if(count > 1) isMultiple = true;
            qlog.info('qoll: ' + qoll + ", types: " + types, filename);
			var qid=Meteor.call('addQoll', action, qoll, types, typesX, isMultiple, qollRawId, qollMasterId, emailsandgroups);
     
                qollId.push(qid);
            });

      qlog.info('Inserted qolls with id: ' + qollId + ", for master-qoll-id: " + qollMasterId);
};

var addQollRaw = function(qollText, qollMasterId) {
	var qollRawId = QollRaw.insert({
		'qollText' : qollText,
		'qollMasterId' : qollMasterId,
		'submittedOn' : new Date(),
		'submittedBy' : Meteor.userId(),
		'submittedByEmail' : getCurrentEmail
	});
	return qollRawId;
};
