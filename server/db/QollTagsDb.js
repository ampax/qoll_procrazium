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

QollTopicsFavsDb = {};

QollTopicsFavsDb.storeFavorites = function(topics, count, activity, type) {
	// store user specific favorites in hierarchical order here
	// representations - 
	// HierarchicalTree - Chemistry -> General -> Physical -> Reactions (10)
	// FlatTree - Chemistry(1), General(2), Physical(5), Reactions(10)
	var err_msgs = [];
	var single_str_favs = topics.join(', ');
	var subscriber = Meteor.userId();

	var handle = QollTopicsFavs.findOne({'subscriber' : subscriber});

	if(handle) {
		err_msgs.push(single_str_favs);

		if('update' === activity) {
			// do nothing since the count hasnt changed
		} else if('delete' === activity || 'archive' === activity) {
			// let us reduce the count by 1 since a qoll is deleted in this category
			// delete is happening but the topic hierarchy exists, decrease the count here
			var cnt = handle.topic_count;
			handle[type].topic_count = cnt - 1;

			var topic_tree = handle[type].topic_tree;
			var moving_favs_hash = topic_tree;
			topics.forEach(function(element, index, array){
				if(moving_favs_hash[element]) {
					// element exists ... increase the count and reset the moving-pointer
					moving_favs_hash[element]['count'] = moving_favs_hash[element]['count'] - 1;
					moving_favs_hash = moving_favs_hash[element];
				}
			});
		} else {
			// insert is happening but the topic hierarchy exists, inclrease the count here
			if(!handle[type]) handle[type] = {topic_tree : {}, topic_count : 0};
			var cnt = handle[type].topic_count;
			handle[type].topic_count = cnt + count;
			// QollTopicsFavs.update({_id : handle._id}, handle);

			var topic_tree = handle[type].topic_tree;
			var moving_favs_hash = topic_tree;
			topics.forEach(function(element, index, array){
				if(moving_favs_hash[element]) {
					// element exists ... increase the count and reset the moving-pointer
					moving_favs_hash[element]['count'] = moving_favs_hash[element]['count'] + count;
					moving_favs_hash = moving_favs_hash[element];
				} else {
					// element does not exist ... create and set the count
					moving_favs_hash[element] = {};
					moving_favs_hash[element]['count'] = count;
					moving_favs_hash[element]['label'] = element;
					moving_favs_hash = moving_favs_hash[element];
				}
			});
		}

		QollTopicsFavs.update({_id : handle._id}, handle);
	} else { 
		var topic_arr = topics;
		var hier_favs = {};

		var moving_favs_hash = hier_favs;
		topics.forEach(function(element, index, array){
			moving_favs_hash[element] = {};
			moving_favs_hash[element]['count'] = count;
			moving_favs_hash[element]['label'] = element;
			moving_favs_hash = moving_favs_hash[element];
			qlog.info('==============================>' + element + '/' + JSON.stringify(hier_favs));
		});
		// moving_favs_hash['count'] = count;

		var d = {};
		d[type] = {'topic_tree' : hier_favs, 'topic_count' : count};
		QollTopicsFavs.insert({'subscriber': subscriber, type : {'topic_tree' : hier_favs, 'topic_count' : count}});
	}
}