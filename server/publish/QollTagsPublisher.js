var filename = 'server/publish/QollTagsPublisher.js';

Meteor.publish('QOLL_TAG_PUBLISHER', function(tag) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	qlog.info('Fetching all the qolls in desc order of creation; uuid: ' + uuid, filename);
	if (this.userId) {
		//submitted by this user or public (default)
		var handle = QollTags.find({}, {reactive : true}
		).observe({
			added : function(item, idx) {
				self.added('tags', item._id, {'tag': item.tag});
			},
			changed : function(item, idx) {
				self.changed('tags', item._id, {'tag': item.tag});
			},
			removed : function(item) {
				self.removed('tags', item._id);
			}
		});

		qlog.info('Done initializing tag publisher: ' + uuid, filename);
		initializing = false;
		self.ready();
		//self.flush();

		self.onStop(function() {
			handle.stop();
		});

	}
});