var filename = 'server/publisher/QollGroupPublisher.js';

Meteor.publish('QOLL_GROUP_PUBLISHER', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Grouppublish; uuid: ' + uuid, filename);
        //db.QOLL.find({'submittedTo':'usr3322@qoll','action':'send'})
        if(this.userId) {//first publish specialized qolls to this user
			qlog.info('Grouppublish USERID --------->>>>>'+this.userId);
			
			
			var gpsraw= QollGroups.find({'submittedBy':this.userId},{fields:{"_id": 1,'groupName':1,'submittedBy':2}},{reactive:false});
	        var allUserGroups = [];
	        gpsraw.forEach(function (grpEntry){
				allUserGroups.push(grpEntry.groupName);
				self.added('qoll-groups', grpEntry._id, {name:grpEntry.groupName});
				});
	              
		
	    
		}
		
        qlog.info('Done initializing the publisher: QOLL_GROUP_PUBLISHER, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
        //self.flush();
}); 


/** Publish a list of friends and groups for the qoll-user-logged-in  **/
Meteor.publish('RECIPIENTS_PUBLISHER', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Group-publish; uuid: ' + uuid + ", this.userid: " + this.userId , filename);
        var handle = undefined;

        if(this.userId) {
        	var allUserGroups = [];

			handle= QollGroups.find({'createdBy':this.userId}, {"_id": 1,'groupName':1,'createdBy':2}, {reactive:false});

	        handle.forEach(function (grp){
				var t = {'name' : grp.groupName, 'createdBy': grp.createdBy, '_id' : grp._id};
				allUserGroups.push(t);
			});

			//TODO: This will come from the user-social-contacts
			handle = Meteor.users.find({}, {'profile': 1}, {reactive:false});
			handle.forEach(function (usr){
				//TODO: name should be name and front end should show a concatenated string of name and email-id
				var t = {'name' : usr.profile.email, 'email' : usr.profile.email, '_id' : usr._id}; 
				allUserGroups.push(t);
			});

			allUserGroups.forEach(function(tx){
				self.added('recipients', tx._id, tx);
			});
		}
		
        qlog.info('Done initializing the publisher: RECIPIENTS_PUBLISHER, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
}); 


/** Publish a list of users not in the network of qoll-user-logged-in  **/
Meteor.publish('QOLLERS_PUBLISHER', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Publish; uuid: ' + uuid + ", this.userid: " + this.userId , filename);
        var handle = undefined;

        if(this.userId) {
        	handle= Meteor.users.find({});
			//handle= QollGroups.find({'submittedBy':this.userId},{fields:{"_id": 1,'groupName':1,'submittedBy':2}},{reactive:false});
	        //var allUserGroups = [];
	        handle.forEach(function (usr){
				//allUserGroups.push(grpEntry.groupName);
				qlog.info("Printing the group-name: " + usr.username, filename);
				self.added('qollers', usr._id, {name:usr.username});
			});
		}
		
        qlog.info('Done initializing the publisher: QOLLERS_PUBLISHER, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
}); 
