var filename = 'server/publish/QollTagsPublisher.js';

Meteor.publish('QOLL_TAG_PUBLISHER', function(tag) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	qlog.info('Fetching all the QOLL_TAG_PUBLISHER in desc order of creation; uuid: ' + uuid, filename);
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

Meteor.publish('QOLL_TOPICS_PUBLISHER', function(topic) {
	var self = this;
	var uuid = Meteor.uuid();
	var initializing = true;
	qlog.info('Fetching all the QOLL_TOPICS_PUBLISHER in desc order of creation; uuid: ' + uuid, filename);
	if (this.userId) {
		//submitted by this user or public (default)
		var handle = QollTopics.find({}, {reactive : true}
		).observe({
			added : function(item, idx) {
				self.added('topics', item._id, {'topic': item.topic});
			},
			changed : function(item, idx) {
				self.changed('topics', item._id, {'topic': item.topic});
			},
			removed : function(item) {
				self.removed('topics', item._id);
			}
		});

		qlog.info('Done initializing topic publisher: ' + uuid, filename);
		initializing = false;
		self.ready();
		//self.flush();

		self.onStop(function() {
			handle.stop();
		});

	}
});

Meteor.methods({
	fetch_tags: function(query){
        
        if(query.search(/,/) != -1) {
          var query = split(query);
          query = query[query.length-1];
        }
        
        var results = new Array();

        results.push({'tag' : query});

        if(query != '') {
          var tags = QollTags.find({'tag': {$regex: '^.*'+query+'.*$', $options: 'i'}} ).fetch();
          tags.forEach(function(t){
          	results.push({'tag' : t.tag});
          });
        }

        /** 
        results.push({'tag' : 'dummy1'});
        results.push({'tag' : 'dummy2'});
        results.push({'tag' : 'dummy3'}); 
        **/

        return results;
    },

    fetch_topics: function(query){
        
        if(query.search(/,/) != -1) {
          var query = split(query);
          query = query[query.length-1];
        }
        
        var results = new Array();

        results.push({'topic' : query});

        if(query != '') {
          var topics = QollTopics.find({'topic': {$regex: '^.*'+query+'.*$', $options: 'i'}} ).fetch();
          topics.forEach(function(t){
          	results.push({'topic' : t.topic});
          });
        }

        
        /** results.push({'topic' : 'dummy1'});
        results.push({'topic' : 'dummy2'});
        results.push({'topic' : 'dummy3'}); **/

        return results;
    },
});

var split = function(val){
  return val.split( /,\s*/ );
};
