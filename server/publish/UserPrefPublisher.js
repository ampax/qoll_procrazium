var filename="server/publish/UserPrefPublisher.js";

Meteor.publish('UserPrefs', function(){
    var handle = UserPrefTbl.find({'userId' : this.userId});
    qlog.info('Publishing user preferences - ' + JSON.stringify(handle.fetch()) + 'for user id - ' + this.userId, filename );
    //qlog.info('Publishing user preferences - ' + JSON.stringify(handle.fetch()) + 'for user id - ' + this.userId, filename );
    handle.rewind()
    return handle;
    /**
    var self = this;
    var uuid = Meteor.uuid();
    var initializing = true;

    if(this.userId) {
        var handle = UserPrefTbl.find({'userId' : this.userId}).observe({
    		added: function(item) {
                qlog.info('Added item - ' + JSON.stringify(item['preferences']) + ' ' + JSON.stringify(item), filename);
    			self.added('user-prefs', item._id, item);
    		},
    		changed: function(item) {
                qlog.info('Changed item - ' + item, filename);
    			self.added('user-prefs', item._id, item);
    		}
    	});
    }

    initializing = false;
    self.ready();
  

    self.onStop(function(){
    	if(handle)
            handle.stop();
    });
    **/

});