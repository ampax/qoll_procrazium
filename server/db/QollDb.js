var filename = 'server/db/QollDb.js';

QollTimerAction = new Meteor.Collection("QOLL_TIMER_ACTION");
/** Database insert method for qolls  **/
Meteor.methods({
	getRawQoll: function(qollrawid){
		var rawqo= QollRaw.findOne({_id:qollrawid});
		return rawqo;
	},
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
	
	addQoll : function(action, qollText, qollTypes, qollTypesX, isMultiple, qollRawId, qollMasterId, emails, isparent, parentid, tags, attributes, qollStarAttributes, qollAttributes) {
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
			'attributes' : attributes
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
		var qollMasterId = QollMaster.insert({
			'qollText' : qollText,
			'tags' : tags,
			'submittedOn' : new Date(),
			'updatedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'visibility' : visibility
		});

		//Store the tags
		var err_msg = QollTagsDb.storeTags(tags);
		qlog.info('Printing tags return results - ' + err_msg, filename);

		addQollsForMaster(qollText, qollMasterId, emailsandgroups, tags, action, visibility);

		return qollMasterId;
	},

	/**		'qollText' : qoll.qollText,
			'tags' : qoll.tags,
			'submittedOn' : new Date(),
			'updatedOn' : new Date(),
			'submittedBy' : Meteor.userId(),
			'submittedByEmail' : getCurrentEmail,
			'visibility' : qoll.visibility,
			'qollFormat' : qoll.qollFormat
			**/
	processStoreHtmlQoll : function(html, emailsandgroups, tags, visibility, action){
		var md = ToMarkdown.convert(html);

		md = md.replace(/(\d+)\.\s+/g, '- ');

		md = md.replace(/\*\s+/g, '- ');

		var master_id = Qolls.QollMasterDb.insert({'qollText' : md, 'tags' : tags, 
			'visibility' : visibility, 'qollFormat' : QollConstants.QOLL.FORMAT.HTML});

		qlog.info('Persisting the html into database - ' + md + ', emailsandgroups - ' + emailsandgroups 
			+ ', tags - ' + tags + ', action - ' + action + ', visibility - ' + visibility + ', master_id - '
			+ master_id, filename);

		return 'Successfully stored the html qoll';
	}
});

/** Helper method for storing qolls for master-qoll-id **/
var addQollsForMaster = function(qollMaster, qollMasterId, emailsandgroups, tags, action, visibility) {
        var regExAnser = /^(a)\s+/;
        var regExNoAnser = /^\s+/;
        var qollId = new Array();
        var qolls = qollMaster.split(/\#\s/); //qolls are seperated by \n#Qoll\s - changed to \n#\s
        qolls = qolls.slice(1);
        qolls.map(function(q){
            var qollRawId = addQollRaw(q, qollMasterId, tags, visibility);
            var qs = q.split(/\n-/);
            var qoll = qs[0];
		var qollType = QollConstants.QOLL_TYPE.MULTI; //multi is by default
		var qollAttributes = {};
		

		//fetch the qoll level attributes here. split the qoll string on * and then apply
        //qlog.info('<==============Printing qoll===============>'+qoll, filename);
        var qoll_parts = qoll.split(/\n\*/);
        var qollStarAttributes = {};
        qoll = qoll_parts[0];
        
        //Start attributes are qoll level inputs like units, hints, and title. Fetch it here
        if(qoll_parts.length > 1) {
            qoll_parts.slice(1).map(function(qp){
            	if(qp) qp = qp.trim();
            	var star = qp.split(/\s+/)[0];
            	var star_val = qp.substr(qp.indexOf(' ') + 1);
            	//qlog.info('<======option name========>' +star, filename);
            	//qlog.info('<======option value========>' +star_val, filename);
            	if(_.contains(QollConstants.EDU.ALLOWED_STARS, star)) {
            		//handle the allowed options here
            		if(_.contains(['unit','units'], star)) {
            			qlog.info('This is unit' + star, filename);
            			if(star_val.indexOf(":") != -1) {
            				var tmp = star_val.split(":");
            				qollStarAttributes[QollConstants.EDU.UNIT_NAME] = tmp[0];
            				star_val = tmp[1];
            			}
            			qollStarAttributes[star] = new Array();
        				star_val.split(/(?:,| )+/).map(function(tmp1){
        					if(tmp1.length > 0) qollStarAttributes[star].push(tmp1);
        				});
            		} else if(star === QollConstants.EDU.ANSWER){
                        //Handle the answer here, first part will be number, second (if there) exponent, and third unit
                        /**
                        Examples - 
                        *answer 9.8*10^2 m/sec2
                        *answer 9.8 10 2 m/sec2
                        *answer 9.8 2 m/sec2
                        **/
                        qollStarAttributes[star] = {};
                        var tmp = [];
                        //star_val = star_val.replace("*", " ").replace("^" " ");
                        if(star_val) {
	                        star_val = star_val.replace("*", " ");
	                        star_val = star_val.replace("^", " ");
	                        tmp = star_val.split(/\s+/);
	                    }

                        if(tmp.length === 1) {
                        	qlog.info('Printing the array from case 1 ' + star_val + '/' + tmp[0], filename);
                            qollStarAttributes[star]['blankResponse'] = tmp[0];
                        } else if(tmp.length === 2){
                            //handle case 1
                            qollStarAttributes[star]['blankResponse'] = tmp[0];
                            qollStarAttributes[star]['power'] = tmp[1];
                        } else if(tmp.length === 3) {
                            //handle case 2
                            qollStarAttributes[star]['blankResponse'] = tmp[0];
                            qollStarAttributes[star]['power'] = tmp[1];
                            qollStarAttributes[star]['unitSelected'] = tmp[2];
                        } else if(tmp.length === 4) {
                            //handle case 3 (simplest, considering default log base-10)
                            qollStarAttributes[star]['blankResponse'] = tmp[0];
                            qollStarAttributes[star]['exponentBase'] = tmp[1];
                            qollStarAttributes[star]['power'] = tmp[2];
                            qollStarAttributes[star]['unitSelected'] = tmp[3];
                        }
                    } else
            			qollStarAttributes[star] = DownTown.downtown(star_val, DownTownOptions.downtown_default());
            	}
            });
        }
        qlog.info('<==========Printing final stars============>'+JSON.stringify(qollStarAttributes), filename);

        qoll = DownTown.downtown(qoll, DownTownOptions.downtown_default());

        //Fetching and initializing all the qoll answers, with correct answers marked
            var count =0;
            var types = new Array();
            var typesX = new Array();
            var attributes = {};
            attributes.visibility = visibility;
            attributes.type = QollConstants.QOLL.TYPE.SINGLE;
            attributes.complexity = QollConstants.QOLL.DIFFICULTY.EASY;
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
            if(count > 1) attributes.type = QollConstants.QOLL.TYPE.MULTIPLE; //isMultiple = true;
		//If this is a single statement fill in the blanks
        if(qoll.indexOf("?==") != -1){
        	qollType = QollConstants.QOLL_TYPE.BLANK_DBL;
        } else if(qoll.indexOf("?=") != -1){
        	qollType = QollConstants.QOLL_TYPE.BLANK;
        }
        //Check for type values, if there is one choice only and has ?= then mark it as BLANK. this can be extended to having
		//more than one choices with blanks in 'em'
		else if(typesX.length === 1) {
			if(typesX[0].type === "?==") {
				qollType = QollConstants.QOLL_TYPE.BLANK_DBL;
			} else if(typesX[0].type === "?="){
				qollType = QollConstants.QOLL_TYPE.BLANK;
        	}
		}
        //Check the type values, if these are true/false then this will be a bool type
		else if(typesX.length === 2) {
			var foundTrue = false, foundFalse = false;
			typesX.map(function(t){
				if(_.contains(['1', 'true', 'True', 'TRUE'], t.type))
					foundTrue = true;

				if(_.contains(['0', 'false', 'False', 'FALSE'], t.type))
					foundFalse = true;
			});

			if(foundTrue && foundFalse)
				qollType = QollConstants.QOLL_TYPE.BOOL;
		}

		//If there are more than one correct answers, this is a multiple choice question
        qlog.info('qoll: ' + qoll + ", types: " + types, filename);
		//Set qoll level attributes here - type, multiple or not, public or personal or org, and all
		qollAttributes.type = qollType;
		qollAttributes.isMultiple = isMultiple;
		var qid = Meteor.call('addQoll', action, qoll, types, typesX, isMultiple, qollRawId, qollMasterId, emailsandgroups, undefined, undefined,  tags, attributes, qollStarAttributes, qollAttributes);
		qollId.push(qid);
        });

      qlog.info('Inserted qolls with id: ' + qollId + ", for master-qoll-id: " + qollMasterId);
};

var addQollRaw = function(qollText, qollMasterId, tags, visibility) {
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
};
