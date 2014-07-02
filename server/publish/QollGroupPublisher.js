var filename = 'server/publisher/QollGroupPublisher.js';

Meteor.publish('QOLL_GROUP_PUBLISHER', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Grouppublish; uuid: ' + uuid, filename);
        //db.QOLL.find({'submittedTo':'usr3322@qoll','action':'send'})
        if(this.userId) {//first publish specialized qolls to this user
			//qlog.info('Grouppublish USERID --------->>>>>'+this.userId);
			
			
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
			handle= QollGroups.find({'submittedBy':this.userId},{fields:{"_id": 1,'groupName':1,'submittedBy':2}},{reactive:false});
	        //var allUserGroups = [];
	        handle.forEach(function (grp){
				//allUserGroups.push(grpEntry.groupName);
				//qlog.info("Printing the group-name: " + grp.groupName, filename);
				self.added('recipients', grp._id, grp);
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


/** Publish a list of friends and groups for the qoll-user-logged-in  **/
Meteor.publish('PUBLISH_GROUPS_OF_USER', function(user_str){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        //qlog.info('=======>Group-publish; uuid: ' + uuid + ", this.userid:<======= " + this.userId + '/' + user_str , filename);
        var handle = undefined;

        if(this.userId) {
			//handle= QollGroups.find({'submittedBy':this.userId},{fields:{"_id": 1,'groupName':1,'submittedBy':2}},{reactive:false});

			var handle_users= Meteor.users.find({ $or: [{'profile.email': {$regex: "/.*"+user_str+".*/", $options: 'i'}}, 
											  {'profile.name': {$regex: "/.*"+user_str+".*/", $options: 'i'}}] });
			handle_users.forEach(function (usr){
				//qlog.info('================>*********Finding groups for user - ' + usr, filename);
				//self.added('user-groups', usr._id, {name:usr.username});
				//handle= QollGroups.find({'submittedBy':usr._Id},{fields:{"_id": 1,'groupName':1,'submittedBy':2}},{reactive:false});
			});

	        /**QollGroups.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
	        handle.forEach(function (grp){
				//allUserGroups.push(grpEntry.groupName);
				qlog.info("Printing the group-name: " + grp.groupName, filename);
				self.added('recipients', grp._id, grp);
			});**/
		}
		
        qlog.info('Done initializing the publisher: PUBLISH_GROUPS_OF_USER, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
});

/** Publish a list of friends and groups for the qoll-user-logged-in  **/
Meteor.publish('PUBLISH_GROUPS_OF_USER_1', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        //qlog.info('=======>Group-publish; uuid: ' + uuid + ", this.userid:<======= " + this.userId, filename);
        var handle = undefined;

        //if(this.userId) {
			//handle= QollGroups.find({fields:{"_id": 1,'groupName':1,'submittedBy':2}},{reactive:false});
			//handle= QollGroups.find();
			handle= QollGroups.find({}, {$sort: {'groupName':-1}});
			
			handle.forEach(function (grp){
				//qlog.info('Printing the user id for the groups ------------>' + grp.submittedBy, filename);
	        	//var handle_usr= Meteor.users.find({},{'_id': grp.submittedBy});
	        	var handle_usr= Meteor.users.findOne(grp.submittedBy);
				//allUserGroups.push(grpEntry.groupName);
				//qlog.info("Printing the group-name:==========> " + grp.groupName + '/' + handle_usr.username, filename);
				grp.author_name = handle_usr.username;
				grp.author_email = handle_usr.profile.email;
				//qlog.info('Printing the group before publishing --------> ' + JSON.stringify(grp), filename);
				self.added('user-groups', grp._id, grp);
			});
		//}
		
        qlog.info('Done initializing the publisher: PUBLISH_GROUPS_OF_USER_1, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
});

