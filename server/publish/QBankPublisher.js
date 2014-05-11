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

