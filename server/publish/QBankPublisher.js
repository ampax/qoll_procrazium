var filename = 'server/publisher/QollPublisher.js';

/** Publishing to the subscribers method for qolls  **/
Meteor.publish('QBANK_SUMMARY_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	qlog.info('Fetching all the qolls in desc order of creation; uuid: ' + uuid, filename);
	if (this.userId) {//first publish specialized qolls to this user
		var ufound = Meteor.users.find({
			"_id" : this.userId
		}).fetch();
		if (ufound.length > 0) {
			var user = ufound[0];

			//submitted by this user
			var handle = QBank.find({
				'submittedBy' : this.userId,
				'action' : {
					$ne : 'archive'
				}
			}, {
				'qollTitle' : 1,
				'qollText' : 1,
				'qollRawId' : 1,
				'submittedOn' : 1
			}, {
				sort : {
					'submittedOn' : -1
				},
				reactive : true
			}).observe({
				added : function(item, idx) {
					qlog.info('Adding, qbid ' + JSON.stringify(item), filename);
					var q = {
						qollTitle : item.qollTitle,
						qollText : item.qollText,
						submittedOn : item.submittedOn,
						viewContext : "createUsr",
						_id : item._id,
						qollRawId : item.qollRawId
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
						qollRawId : item.qollRawId
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
	qlog.info('Done initializing the publisher: QBANK_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		handle.stop();
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
	if(q._id === 'pBRwzigvnqbuyhT6T' || q._id === 'AGWMCxhPtb2aGyhuj') {
		//qlog.info('=======>qollTypesX =====>' + JSON.stringify(q.qollTypesX), filename)
	}
	q.qollTypesX.map(function(qtx){
		if(qtx.isCorrect && qtx.isCorrect === 1) stat.correct_answers.push(alphabetical[qtx_idx]);
		qtx_idx++;
	});

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
			if(reg) {
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


