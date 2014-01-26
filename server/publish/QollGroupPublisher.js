var filename = 'server/publisher/QollGroupPublisher.js';

/** Publishing to the subscribers method for qolls  **/
Meteor.publish('QOLL_GROUP_PUBLISHER', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Fetching all the qolls in desc order of creation; uuid: ' + uuid, filename);
        //db.QOLL.find({'submittedTo':'usr3322@qoll','action':'send'})
        if(this.userId) {//first publish specialized qolls to this user
			qlog.info('MY  USERID --------->>>>>'+this.userId);
			var ufound = Meteor.users.find({"_id":this.userId},{reactive: false}).fetch();
			if (ufound.length>0){
			var user= ufound[0];
			qlog.info('MY  USER --------->>>>>'+user.groupsCreated);
			qlog.info('MY  USER --------->>>>>'+user.groupsCreated);
			
			
	        var allUserGroups = [];
	        (user.groupsCreated||[]).map(function (grpEntry){
				allUserGroups.push(grpEntry);
				self.added('qoll-groups', grpEntry, {name:grpEntry});
				});
	              
		}
	    
		}
		
        qlog.info('Done initializing the publisher: QOLL_GROUP_PUBLISHER, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
        //self.flush();
}); 
