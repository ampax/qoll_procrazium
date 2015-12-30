var filename = 'server/db/QollTagsDb.js';

QollTagsDb = {};

QollTagsDb.storeTags = function(tags) {
	var err_msgs = [];
	tags.forEach(function(tag){
		var handle = QollTags.findOne({'tag': tag});
		if(handle) {
			err_msgs.push(tag);
		} else { //FUTURE: We will check the credentials of the person creating the tags from front end for this
			QollTags.insert({'createdBy': Meteor.userId(), 'tag': tag});
		}
	});

	if(err_msgs.length > 0) {
		err_msgs.push(' already exist');
	}

	return err_msgs;
}


QollTopicsDb = {};

QollTopicsDb.storeTopics = function(topics) {
	var err_msgs = [];
	topics.forEach(function(topic){
		var handle = QollTopics.findOne({'topic': topic});
		if(handle) {
			err_msgs.push(topic);
		} else { //FUTURE: We will check the credentials of the person creating the tags from front end for this
			QollTopics.insert({'createdBy': Meteor.userId(), 'topic': topic});
		}
	});

	if(err_msgs.length > 0) {
		err_msgs.push(' already exist');
	}

	return err_msgs;
}