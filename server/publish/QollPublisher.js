var filename = 'server/publisher/QollPublisher.js';

/** Publishing to the subscribers method for qolls  **/
Meteor.publish('All_QOLL_PUBLISHER', function(findoptions) {
	var self = this;
	var uuid = Meteor.uuid();
	var lim = findoptions.limit || 10000;
	qlog.info('Publisher options' + JSON.stringify(findoptions));
	//this hardcoding will never come to bite us later right?
	var parentId = findoptions.parentId;
	var parent_id_param = {
		$exists : false
	};
	if (parentId)// params include parent id
	{
		parent_id_param = parentId;
		// replace 1234 with parent id
	}
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
				qlog.info('REG  USER --------->>>>>' + JSON.stringify(reguser[0].emails[0].address));
				if (reguser && reguser[0] && reguser[0].emails && reguser[0].emails[0].address) {
					register_emails[thisReg.submittedBy] = reguser[0].emails[0].address;
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
				'submittedBy' : this.userId,
				'action' : {
					$ne : 'archive'
				},
				parentId : parent_id_param
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
						qollTitle 		: item.qollTitle,
						qollText 		: item.qollText,
						qollTypes 		: item.qollTypes,
						qollTypesX 		: item.qollTypesX,
						qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
						qollAttributes 	: item.qollAttributes,
						submittedOn 	: item.submittedOn,
						submittedBy 	: item.submittedBy,
						submittedTo 	: item.submittedTo,
						action 			: item.action,
						enableEdit 		: item.action === 'store',
						stats 			: item.stats,
						//answers 		: fetch_answers(item),
						totals 			: sumstats(item.stats),
						viewContext 	: "createUsr",

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
						qollTitle 			: item.qollTitle,
						qollText 			: item.qollText,
						qollTypes 			: item.qollTypes,
						qollTypesX 			: item.qollTypesX,
						qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
						qollAttributes 		: item.qollAttributes,
						submittedOn 		: item.submittedOn,
						submittedBy 		: item.submittedBy,
						submittedTo 		: item.submittedTo,
						action 				: item.action,
						enableEdit 			: item.action === 'store',
						stats 				: item.stats,
						//answers 			: fetch_answers(item),
						totals 				: sumstats(item.stats),
						viewContext 		: "createUsr",

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
			qlog.info('looking for ' +JSON.stringify({
				'submittedTo' : user.emails[0].address,
				'action' : 'send',
				parentId : parent_id_param
			}));
			var handle = Qoll.find({
				'submittedTo' : user.emails[0].address,
				'action' : 'send',
				parentId : parent_id_param
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
						sentby = usentby[0].emails[0].address;
					var q = {
						qollTitle : item.qollTitle,
						qollText : item.qollText,
						qollTypes : item.qollTypes,
						qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
						qollAttributes 	: item.qollAttributes,
						submittedOn : item.submittedOn,
						submittedBy : item.submittedBy,
						sendingUser : sentby,
						submittedTo : item.submittedTo,
						action : item.action,
						viewContext : "recieveUsr",

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
					parentId : parent_id_param
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
							sentby = usentby[0].emails[0].address;
						var q = {
							qollTitle : item.qollTitle,
							qollText : item.qollText,
							qollTypes : item.qollTypes,
							qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
							qollAttributes 	: item.qollAttributes,
							submittedOn : item.submittedOn,
							submittedBy : item.submittedBy,
							sendingUser : sentby,
							submittedTo : item.submittedTo,
							action : item.action,
							viewContext : "recieveUsr",

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
			}
		}
		// here we proceed with publishing qolls to group that no one is member of
	}
	var handle = Qoll.find({
		'submittedTo' : '',
		'action' : 'send',
		parentId : parent_id_param
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
				qollTitle : item.qollTitle,
				qollText : item.qollText,
				qollTypes : item.qollTypes,
				qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
				qollAttributes 	: item.qollAttributes,
				submittedOn : item.submittedOn,
				submittedBy : item.submittedBy,
				submittedTo : item.submittedTo,
				action : item.action,
				viewContext : "publicQolls",
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
					qollTitle : item.qollTitle,
					qollText : item.qollText,
					qollTypes : item.qollTypes,
					qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
					qollAttributes 	: item.qollAttributes,
					submittedOn : item.submittedOn,
					submittedBy : item.submittedBy,
					submittedTo : item.submittedTo,
					action : item.action,
					stats : item.stats,
					totals : sumstats(item.stats),
					viewContext : "createUsr",

					_id : item._id
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
					qollTitle : item.qollTitle,
					qollText : item.qollText,
					qollTypes : item.qollTypes,
					qollStarAttributes : item.qollStarAttributes ? item.qollStarAttributes : {},
					qollAttributes 	: item.qollAttributes,
					submittedOn : item.submittedOn,
					submittedBy : item.submittedBy,
					submittedTo : item.submittedTo,
					action : item.action,
					stats : item.stats,
					totals : sumstats(item.stats),
					viewContext : "createUsr",

					_id : item._id
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
