var filename = 'server/publisher/QollPublisher.js';


/** Publishing to the subscribers method for qolls  **/
Meteor.publish('All_QOLL_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var lim = findoptions.limit || 10000;
	qlog.info('Publisher options' + JSON.stringify(findoptions));
	//this hardcoding will never come to bite us later right?
	var parentId = findoptions.parentId;
	var myId = findoptions.singleId;
	var parent_id_param = {
		$exists : false
	};
	var my_id_param = {
		$exists : true
	};
	
	if (parentId)// params include parent id
	{
		parent_id_param = parentId;
	}
	if(myId){
		my_id_param = myId;
	}
	var initializing = true;
	
	var register_emails = {};
	//to cache emails for usr ids
	var fetch_answers = function(item) {
		var answers;
		answers = [];
		if(item.parentId) return answers;
		var existQollRegs = QollRegister.find({
			qollId : item._id
		}, {
			reactive : false
		}).fetch();

		for (var i = 0; i < item.qollTypes.length; i++) {
			answers[i] = [];
		}

		for (var i = 0; i < existQollRegs.length; i++) {
			var thisReg;
			thisReg = existQollRegs[i];

			if (register_emails.hasOwnProperty(thisReg.submittedBy)) {
				thisReg['responder_email'] = register_emails[thisReg.submittedBy];
				answers[thisReg.qollTypeIndex].push(thisReg['responder_email']);
			} else {
				var reguser = Meteor.users.find({
					"_id" : thisReg.submittedBy
				}).fetch();
				qlog.info('REG  USER --------->>>>>' + JSON.stringify(UserUtil.getEmail(reguser[0])));
				if (reguser && reguser[0] && reguser[0].emails && reguser[0].profile.email) {
					register_emails[thisReg.submittedBy] = reguser[0].profile.email;
					thisReg['responder_email'] = register_emails[thisReg.submittedBy];
					answers[thisReg.qollTypeIndex].push(thisReg['responder_email']);
				}
			}

		}
		return answers;

	};
	qlog.info('Fetching all the qolls in desc order of creation; uuid: ' + uuid, filename);
	if (this.userId) {//first publish specialized qolls to this user
		var ufound = Meteor.users.find({
			"_id" : this.userId
		}).fetch();
		if (ufound.length > 0) {
			var user = ufound[0];

			//submitted by this user
			var handle = Qoll.find({
				//'submittedBy' : this.userId,
				'action' : {
					$ne : 'archive'
				},
				parentId : parent_id_param,
				_id :my_id_param
			}, {
				sort : {
					'submittedOn' : -1
				},
				reactive : true,
				limit : lim
			}).observe({
				added : function(item, idx) {
					lim -= 1;

					var q = {
						qollTitle 		: item.title,
						qollText 		: item.qollText,
						qollTypes 		: translateToIndexedArray(item.qollTypes),
						qollTypesX 		: item.qollTypesX,

						cat 			: item.cat,
						answer 			: item.answer,
						fib 			: item.fib,
						hint 			: item.hint,
						unit_name 		: item.unit_name,
						unit 			: item.unit,
						visibility 		: item.visibility,
						complexity 		: item.complexity,

						//qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
						//qollAttributes 	: item.qollAttributes,
						submittedOn 	: item.submittedOn,
						submittedBy 	: item.submittedBy,
						submittedTo 	: item.submittedTo,
						action 			: item.action,
						enableEdit 		: item.action === 'store',
						stats 			: item.stats,
						//answers 		: fetch_answers(item),
						totals 			: sumstats(item.stats),
						viewContext 	: "createUsr",
						context 		: findoptions.context,
						isMultiple		: item.isMultiple,

						_id : item._id,
						qollRawId : item.qollRawId
					};
					if (item.is_parent)
						q.is_parent = true;
					//get qoll registers
					var reg = findQollRegisters(q.submittedBy, item._id);
					q.myAnswers = reg;
					q.qollTypeReg = reg.qollTypeReg;
					q.qollTypeVal = reg.qollTypeVal;
					q.myAnswers = reg;
					/**Meteor.call('findQollRegisters', q.submittedBy, item._id, function(err, reg) {
						if (err) {
							qlog.error('Error happened while getting registers' + err, filename);
						} else {
							qlog.info('Found qoll regs. Processing now ' + JSON.stringify(reg), filename);
							if (reg != undefined) {
								q.qollTypeReg = reg.qollTypeReg;
								q.myAnswers = reg;
							}
						}
					});**/

					self.added('all-qolls', item._id, q);

				},
				changed : function(item, idx) {

					var q = {
						qollTitle 			: item.title,
						qollText 			: item.qollText,
						qollTypes 			: translateToIndexedArray(item.qollTypes),
						qollTypesX 			: item.qollTypesX,

						cat 				: item.cat,
						answer 				: item.answer,
						fib 				: item.fib,
						hint 				: item.hint,
						unit_name 			: item.unit_name,
						unit 				: item.unit,
						visibility 			: item.visibility,
						complexity 			: item.complexity,

						//qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
						//qollAttributes 		: item.qollAttributes,
						submittedOn 		: item.submittedOn,
						submittedBy 		: item.submittedBy,
						submittedTo 		: item.submittedTo,
						action 				: item.action,
						enableEdit 			: item.action === 'store',
						stats 				: item.stats,
						//answers 			: fetch_answers(item),
						totals 				: sumstats(item.stats),
						viewContext 		: "createUsr",
						context 			: findoptions.context,
						isMultiple			: item.isMultiple,

						_id : item._id,
						qollRawId : item.qollRawId
					};
					if (item.is_parent)
						q.is_parent = true;
					//get qoll registers
					var reg = findQollRegisters(q.submittedBy, item._id);
					q.myAnswers = reg;
					q.qollTypeReg = reg.qollTypeReg;
					q.qollTypeVal = reg.qollTypeVal;
					q.myAnswers = reg;
					/** Meteor.call('findQollRegisters', q.submittedBy, item._id, function(err, reg) {
						if (err) {
							qlog.error('Error happened while getting registers' + err, filename);
						} else {
							qlog.info('Found qoll regs. Processing now ' + JSON.stringify(reg), filename);
							if (reg != undefined) {
								q.qollTypeReg = reg.qollTypeReg;
								q.myAnswers = reg;
							}
						}
					}); **/

					self.changed('all-qolls', item._id, q);

				},
				removed : function(item) {

					self.removed('all-qolls', item._id);
					qlog.info('Removed item with id: ' + item._id);

				}
			});
			qlog.info('looking for ' +JSON.stringify({'submittedTo' : UserUtil.getEmail(user), 'action' : 'send', parentId : parent_id_param,
				_id :my_id_param}));
			var handle = Qoll.find({ 'submittedTo' : UserUtil.getEmail(user), 'action' : 'send', parentId : parent_id_param,
				_id :my_id_param }, 
				{ sort : { 'submittedOn' : -1}, limit : lim, fields : { stats : 0 }, reactive : true }
			).observe({
				added : function(item, idx) {
					lim -= 1;
					var usentby = Meteor.users.find({
						"_id" : item.submittedBy
					}).fetch();
					var sentby = '';
					if (usentby.length > 0)
						sentby = UserUtil.getEmail(usentby[0]);
					var q = {
						qollTitle 			: item.title,
						qollText 			: item.qollText,
						qollTypes 			: translateToIndexedArray(item.qollTypes),

						cat 				: item.cat,
						answer 				: item.answer,
						fib 				: [],//item.fib,
						hint 				: item.hint,
						unit_name 			: item.unit_name,
						unit 				: item.unit,
						visibility 			: item.visibility,
						complexity 			: item.complexity,

						//qollStarAttributes 	: item.qollStarAttributes ? item.qollStarAttributes : {},
						//qollAttributes 		: item.qollAttributes,
						submittedOn 		: item.submittedOn,
						submittedBy 		: item.submittedBy,
						sendingUser 		: sentby,
						submittedTo 		: item.submittedTo,
						action 				: item.action,
						viewContext 		: "recieveUsr",
						context 			: findoptions.context,
						isMultiple			: item.isMultiple,

						_id : item._id
					};
					if (item.is_parent)
						q.is_parent = true;
					//get qoll registers
					var reg = findQollRegisters(this.userId, item._id);
					q.myAnswers = reg;
					q.qollTypeReg = reg.qollTypeReg;
					q.qollTypeVal = reg.qollTypeVal;
					q.myAnswers = reg;
					/**Meteor.call('findQollRegisters', this.userId, item._id, function(err, qollTypeReg) {
						if (err) {
							qlog.error('Error happened while getting registers' + err, filename);
						} else {
							qlog.info('Found qoll regs. Processing now ' + qollTypeReg, filename);
							if (qollTypeReg != undefined)
								q.qollTypeReg = qollTypeReg;
						}
					});**/

					self.added('all-qolls', item._id, q);
					//qlog.info('Adding another DIRECT RECIEVED qoll --------->>>>>'+item._id,filename);

				},
				removed : function(item) {
					if (item.submittedBy !== user._id) {
						self.removed('all-qolls', item._id);
						qlog.info('Removed item with id: ' + item._id);
					}
				}
			});
			var gpsraw = QollGroups.find({
				'userEmails' : UserUtil.getEmail(user)
			}, {
				fields : {
					"_id" : 0,
					'groupName' : 1,
					'submittedBy' : 2
				}
			}, {
				reactive : false
			});
			var allUserGroups = [];
			gpsraw.forEach(function(grpEntry) {
				allUserGroups.push({
					'submittedToGroup' : grpEntry.groupName,
					'submittedBy' : grpEntry.submittedBy
				});
			});
			if (allUserGroups.length > 0) {
				var handle = Qoll.find({
					'$or' : allUserGroups,
					'action' : 'send',
					parentId : parent_id_param,
				_id :my_id_param
				}, {
					sort : {
						'submittedOn' : -1
					},
					limit : lim,
					fields : {
						stats : 0
					},
					reactive : true
				}).observe({
					added : function(item, idx) {
						lim -= 1;
						var usentby = Meteor.users.find({
							"_id" : item.submittedBy
						}).fetch();
						var sentby = '';
						if (usentby.length > 0)
							sentby = UserUtil.getEmail(usentby[0]);
						var q = {
							qollTitle 		: item.title,
							qollText 		: item.qollText,
							qollTypes 		: translateToIndexedArray(item.qollTypes),

							cat 			: item.cat,
							answer 			: item.answer,
							fib 			: [],//item.fib,
							hint 			: item.hint,
							unit_name 		: item.unit_name,
							unit 			: item.unit,
							visibility 		: item.visibility,
							complexity 		: item.complexity,

							//qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
							//qollAttributes 	: item.qollAttributes,
							submittedOn 	: item.submittedOn,
							submittedBy 	: item.submittedBy,
							sendingUser 	: sentby,
							submittedTo 	: item.submittedTo,
							action 			: item.action,
							viewContext 	: "recieveUsr",
							context 		: findoptions.context,
							isMultiple		: item.isMultiple,

							_id 			: item._id
						};
						if (item.is_parent)
							q.is_parent = true;
						//get qoll registers
						var reg = findQollRegisters(this.userId, item._id);
						q.myAnswers = reg;
						q.qollTypeReg = reg.qollTypeReg;
						q.qollTypeVal = reg.qollTypeVal;
						q.myAnswers = reg;
						/**Meteor.call('findQollRegisters', this.userId, item._id, function(err, qollTypeReg) {
							if (err) {
								qlog.error('Error happened while getting registers' + err, filename);
							} else {
								qlog.info('Found qoll regs. Processing now ' + qollTypeReg, filename);
								if (qollTypeReg != undefined)
									q.qollTypeReg = qollTypeReg;
							}
						});**/

						self.added('all-qolls', item._id, q);
						//qlog.info('Adding another DIRECT RECIEVED qoll --------->>>>>'+item._id,filename);

					},
					removed : function(item) {
						if (item.submittedBy !== user._id) {
							self.removed('all-qolls', item._id);
							qlog.info('Removed item with id: ' + item._id);
						}
					}
				});
			}
		}
		// here we proceed with publishing qolls to group that no one is member of
	}
	var handle = Qoll.find({
		'submittedTo' : '',
		'action' : 'send',
		parentId : parent_id_param,
				_id :my_id_param
	}, {
		sort : {
			'submittedOn' : -1
		},
		limit : lim,
		fields : {
			stats : 0
		},
		reactive : true
	}).observe({
		added : function(item, idx) {
			lim -= 1;
			var q = {
				qollTitle 		: item.title,
				qollText 		: item.qollText,
				qollTypes 		: translateToIndexedArray(item.qollTypes),

				cat 			: item.cat,
				answer 			: item.answer,
				fib 			: [],//item.fib,
				hint 			: item.hint,
				unit_name 		: item.unit_name,
				unit 			: item.unit,
				visibility 		: item.visibility,
				complexity 		: item.complexity,

				//qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
				//qollAttributes 	: item.qollAttributes,
				submittedOn 	: item.submittedOn,
				submittedBy 	: item.submittedBy,
				submittedTo 	: item.submittedTo,
				action 			: item.action,
				viewContext 	: "publicQolls",
				context 		: findoptions.context,
				isMultiple		: item.isMultiple,
				_id 			: item._id
			};
			if (item.is_parent)
				q.is_parent = true;
			//get qoll registers
			var reg = findQollRegisters(this.userId, item._id);
			q.myAnswers = reg;
			q.qollTypeReg = reg.qollTypeReg;
			q.qollTypeVal = reg.qollTypeVal;
			q.myAnswers = reg;
			/**Meteor.call('findQollRegisters', this.userId, item._id, function(err, qollTypeReg) {
				if (err) {
					qlog.error('Error happened while getting registers' + err, filename);
				} else {
					qlog.info('Found qoll regs. Processing now ' + qollTypeReg, filename);
					if (qollTypeReg != undefined)
						q.qollTypeReg = qollTypeReg;
				}
			});**/

			self.added('all-qolls', item._id, q);

		}
	});
	//finally publish all public qolls
	qlog.info('Done initializing the publisher: All_QOLL_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		handle.stop();
	});
});

/**
 * This method publishes all the qolls for the user which are still open for edit.
 * Further variants for this section can be - clone an active or deactivated qoll
 * to create new qolls or reopen a qoll for public
 **/
Meteor.publish('OPEN_QOLL_PUBLISHER', function() {
	//Get all the qolls created by this user which are still open for edit
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var sumstats = function(statsobj) {
		ret = 0;
		for (var key in statsobj) {
			if (statsobj.hasOwnProperty(key)) {

				ret = ret + statsobj[key];

			}
		}
		return ret;
	};
	if (this.userId) {
		var handle = Qoll.find({
			'submittedBy' : this.userId,
			action : {
				$in : ["store"]
			}
		}, {
			sort : {
				'submittedOn' : -1
			},
			reactive : true
		}).observe({
			added : function(item, idx) {

				var q = {
					qollTitle 		: item.title,
					qollText 		: item.qollText,
					qollTypes 		: translateToIndexedArray(item.qollTypes),

					cat 			: item.cat,
					answer 			: item.answer,
					fib 			: item.fib,
					hint 			: item.hint,
					unit_name 		: item.unit_name,
					unit 			: item.unit,
					visibility 		: item.visibility,
					complexity 		: item.complexity,
					//qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
					//qollAttributes 	: item.qollAttributes,
					submittedOn 	: item.submittedOn,
					submittedBy 	: item.submittedBy,
					submittedTo 	: item.submittedTo,
					action 			: item.action,
					stats 			: item.stats,
					totals 			: sumstats(item.stats),
					viewContext 	: "createUsr",
					isMultiple		: item.isMultiple,

					_id 			: item._id
				};

				//get qoll registers
				var reg = findQollRegisters(this.userId, item._id);
				q.myAnswers = reg;
				q.qollTypeReg = reg.qollTypeReg;
				q.qollTypeVal = reg.qollTypeVal;
				q.myAnswers = reg;
				/**Meteor.call('findQollRegisters', this.userId, item._id, function(err, qollTypeReg) {
					if (err) {
						qlog.error('Error happened while getting registers' + err, filename);
					} else {
						qlog.info('Found qoll regs. Processing now ' + qollTypeReg, filename);
						if (qollTypeReg != undefined)
							q.qollTypeReg = qollTypeReg;
					}
				});**/

				self.added('all-open-qolls', item._id, q);
				//qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

			},
			changed : function(item, idx) {

				var q = {
					qollTitle 		: item.title,
					qollText 		: item.qollText,
					qollTypes 		: translateToIndexedArray(item.qollTypes),

					cat 			: item.cat,
					answer 			: item.answer,
					fib 			: item.fib,
					hint 			: item.hint,
					unit_name 		: item.unit_name,
					unit 			: item.unit,
					visibility 		: item.visibility,
					complexity 		: item.complexity,
					//qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
					//qollAttributes 	: item.qollAttributes,
					submittedOn 	: item.submittedOn,
					submittedBy 	: item.submittedBy,
					submittedTo 	: item.submittedTo,
					action 			: item.action,
					stats 			: item.stats,
					totals 			: sumstats(item.stats),
					viewContext 	: "createUsr",
					isMultiple		: item.isMultiple,

					_id 			: item._id
				};

				//get qoll registers
				var reg = findQollRegisters(this.userId, item._id);
				q.myAnswers = reg;
				q.qollTypeReg = reg.qollTypeReg;
				q.qollTypeVal = reg.qollTypeVal;
				q.myAnswers = reg;
				/**Meteor.call('findQollRegisters', this.userId, item._id, function(err, qollTypeReg) {
					if (err) {
						qlog.error('Error happened while getting registers' + err, filename);
					} else {
						qlog.info('Found qoll regs. Processing now ' + qollTypeReg, filename);
						if (qollTypeReg != undefined)
							q.qollTypeReg = qollTypeReg;
					}
				});**/

				self.changed('all-open-qolls', item._id, q);
				//qlog.info('Adding another self published qoll --------->>>>>'+item._id,filename);

			},
			removed : function(item) {
				self.removed('all-open-qolls', item._id);
				qlog.info('Removed item with id: ' + item._id);
			}
		});

		self.ready();
		self.onStop(function() {
			qlog.info('Stopping the OPEN_QOLL_PUBLISHER publisher: ' + this.userId, filename);
			handle.stop();
		});
	}
});



Meteor.publish('BATTLEG_QOLL_PUBLISHER', function(findoptions) {
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
			handle_my_active_qolls = Qoll.find(
				{'submittedBy' : this.userId,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}, 'submittedOn' : {$lt : targetDate}}, 
				//{'qollTitle' : 1, 'qollText' : 1, 'qollRawId' : 1, 'submittedOn' : 1, 'qollTypesX' : 1, 'attributes' : 1}, 
				{sort : {'submittedOn' : -1}, limit : lim, reactive : true}
			).observe({
				added : function(item, idx){
					self.added('my_active_qolls', item._id, fetchMyConciseQollInfo(item));
				},
				changed : function(item, idx){
					self.added('my_active_qolls', item._id, fetchMyConciseQollInfo(item));
				},
				removed : function(item){
					self.removed('my_active_qolls', item._id);
				}
			});
			
		}

	}
	qlog.info('Done initializing the publisher: BATTLEG_QOLL_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		handle_my_active_qolls.stop();
	});
});



/************************************************** NEW QOLL PUBLISHER ****************************************/
//Publish qolls in set of QollConstants.QOLL.PUBLISH_SIZE (set to 100)
/****
Publish the following qolls
	(1) My own created qolls - all created by me, and not yet archived
	(2) My own recieved qolls - all recieved and responded by me
	(3) All public qolls - all the qolls created which are public
	(4) My groups - All groups that I have created
	(5) My group's qoll - All qolls sent to this group
	(6) My qollstionnaires - All qollstionnaires created by me
****/
Meteor.publish('QOLL_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	var lim = QollConstants.QOLL.PUBLISH_SIZE;
	var targetDate = findoptions.submittedOn;
	var groupName = findoptions.groupName;

	if(!targetDate) targetDate = new Date();

	qlog.info('Fetching all the qolls (for 1,2,3,4,5, and 6 use cases) in desc order of creation; uuid: ' + uuid, filename);
	if (this.userId) {
		//Check for existing user record
		var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
		if (ufound.length > 0) {
			//User found, will publish different qolls to user now
			var user = ufound[0];

			//Publishing my own created qolls (in chunks of 100) --- (1) My own created qolls - all created by me, and not yet archived
			var handle_my_active_qolls = Qoll.find(
				{'submittedBy' : this.userId,'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}, 'submittedOn' : {$lt : targetDate}}, 
				//{'qollTitle' : 1, 'qollText' : 1, 'qollRawId' : 1, 'submittedOn' : 1, 'qollTypesX' : 1, 'attributes' : 1}, 
				{sort : {'submittedOn' : -1}, limit : lim, reactive : true}
			).observe({
				added : function(item, idx){
					self.added('my_active_qolls', item._id, fetchMyConciseQollInfo(item));
				},
				changed : function(item, idx){
					self.added('my_active_qolls', item._id, fetchMyConciseQollInfo(item));
				},
				removed : function(item){
					self.removed('my_active_qolls', item._id);
				}
			});


			//Publishing my received qolls (in chunks of 100) --- (2) My own recieved qolls - all recieved and responded by me
			var handle_my_rec_qolls = Qoll.find(
				{ 'submittedTo' : UserUtil.getEmail(user), 'action' : QollConstants.QOLL_ACTION_SEND, 'submittedOn' : {$lt : targetDate}},
				{ sort : { 'submittedOn' : -1}, limit : lim, reactive : true }
			).observe({
				added : function(item, idx){
					self.added('my_rec_qolls', item._id, fetchMyRecConciseQollInfo(item));
				},
				changed : function(item, idx){
					self.added('my_rec_qolls', item._id, fetchMyRecConciseQollInfo(item));
				},
				removed : function(item){
					self.removed('my_rec_qolls', item._id);
				}
			});


			//Publishing all public qolls (in chunks of 100) --- (3) All public qolls - all the qolls created which are public
			var handle_public_qolls = Qoll.find(
				{$or: [{'submittedBy' : this.userId, 'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}}, 
						{'attributes.visibility': QollConstants.QOLL.VISIBILITY.PUB}], 'submittedOn' : {$lt : targetDate}}, 
				//{'qollTitle' : 1, 'qollText' : 1, 'qollRawId' : 1, 'submittedOn' : 1, 'qollTypesX' : 1, 'attributes' : 1}, 
				{sort : {'submittedOn' : -1}, limit : lim, reactive : true}
			).observe({
				added : function(item, idx){
					self.added('mine_and_public_qolls', item._id, fetchConciseQollInfo(item));
				},
				changed : function(item, idx){
					self.added('mine_and_public_qolls', item._id, fetchConciseQollInfo(item));
				},
				removed : function(item){
					self.removed('mine_and_public_qolls', item._id);
				}
			});


			//Publishing all the groups created by this user --- (4) My groups - All groups that I have created
			var handle_groups = QollGroups.find(
				{'submittedBy':this.userId},{fields:{"_id": 1,'groupName':1,'submittedBy':2}},{reactive:false}
			).observe({
				added : function(item, idx){
					self.added('my_group', item._id, {'name' : item.groupName});
				},
				changed : function(item, idx){
					self.added('my_group', item._id, {'name' : item.groupName});
				},
				removed : function(item){
					self.removed('my_group', item._id);
				}
			});


			//Publishing all the qolls sent to the group --- (5) My group's qoll - All qolls sent to this group
			var handle_group_qolls = Qoll.find(
				{ 'submittedToGroup' : groupName, 'submittedOn' : {$lt : targetDate}}, { sort : { 'groupName' : -1}, reactive : false }
			).observe({
				added : function(item, idx){
					self.added('group_qolls', item._id, fetchConciseQollInfo(item));
				},
				changed : function(item, idx){
					self.added('group_qolls', item._id, fetchConciseQollInfo(item));
				},
				removed : function(item){
					self.removed('group_qolls', item._id);
				}
			});


			//Publishing all qollstionnaires --- (6) My qollstionnaires - All qollstionnaires created by me
			var handle_my_qollstionnaires = Qoll.find({$or: [{'submittedBy' : this.userId, 'action' : {$ne : QollConstants.QOLL_ACTION_ARCHIVE}}, 
				{'attributes.visibility': QollConstants.QOLL.VISIBILITY.PUB}]}, 
				//{'qollTitle' : 1, 'qollText' : 1, 'qollRawId' : 1, 'submittedOn' : 1, 'qollTypesX' : 1, 'attributes' : 1}, 
				{sort : {'submittedOn' : -1}, limit : lim, reactive : true}
			).observe({
				added : function(item, idx){
					self.added('my_qollstionnaires', item._id, fetchConciseQolstInfo(item));
				},
				changed : function(item, idx){
					self.added('my_qollstionnaires', item._id, fetchConciseQolstInfo(item));
				},
				removed : function(item){
					self.removed('my_qollstionnaires', item._id);
				}
			});
			
		}

	}
	qlog.info('Done initializing the publisher: QBANK_PUBLISHER, uuid: ' + uuid, filename);
	initializing = false;
	self.ready();
	//self.flush();

	self.onStop(function() {
		handle_my_active_qolls.stop();
		handle_my_rec_qolls.stop();
		handle_public_qolls.stop();
		handle_groups.stop();
		handle_group_qolls.stop();
	});
});

var fetchConciseQollInfo = function(item) {
	return {
				qollTitle : item.title,
				qollText : item.qollText,
				qollTypes : translateToIndexedArray(item.qollTypes),
				submittedOn : item.submittedOn,
				submittedBy : item.submittedBy,
				submittedTo : item.submittedTo,
				action : item.action,
				viewContext : QollConstants.QOLL.USER_CTX.CREATE,
				_id : item._id
			};
};


var fetchMyConciseQollInfo = function(item) {
	return {
				qollTitle : item.title,
				qollText : item.qollText,
				qollTypes : translateToIndexedArray(item.qollTypes),
				submittedOn : item.submittedOn,
				submittedBy : item.submittedBy,
				submittedTo : item.submittedTo,
				action : item.action,
				stats : item.stats,
				totals : sumstats(item.stats),
				viewContext : QollConstants.QOLL.USER_CTX.CREATE,
				_id : item._id
			};
};

var fetchMyRecConciseQollInfo = function(item) {
	return {
				qollTitle : item.title,
				qollText : item.qollText,
				qollTypes : translateToIndexedArray(item.qollTypes),
				submittedOn : item.submittedOn,
				submittedBy : item.submittedBy,
				submittedTo : item.submittedTo,
				action : item.action,
				stats : item.stats,
				totals : sumstats(item.stats),
				viewContext : QollConstants.QOLL.USER_CTX.CREATE,
				_id : item._id
			};
};

var fetchConciseQolstInfo = function(item) {
	return item;
};


var sumstats = function(statsobj) {
	ret = 0;
	for (var key in statsobj) {
		if (statsobj.hasOwnProperty(key)) {
			ret = ret + statsobj[key];
		}
	}
	return ret;
};

var translateToIndexedArray = function ( ar){
		if(!ar) return [];
		return ar.map(function (item,ix){ return {index : ix, value : item};});
};
