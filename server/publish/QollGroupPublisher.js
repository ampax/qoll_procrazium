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
Meteor.publish('PUBLISH_GROUPS_OF_USER_1', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('=======>Group-publish; uuid: ' + uuid + ", this.userid:<======= " + this.userId, filename);
        var handle = undefined;

        //if(this.userId) {
			//handle= QollGroups.find({fields:{"_id": 1,'groupName':1,'submittedBy':2}},{reactive:false});
			//handle= QollGroups.find();
      var handle = QollGroups.find({}, {$sort: {'groupName':-1}, reactive : true }).observe({
        added : function(grp, idx){
          var handle_usr= Meteor.users.findOne(grp.submittedBy);

          /** Need to fix the users instead of bypassing it here **/
          if(handle_usr == undefined || handle_usr.username == undefined)
            return;

          grp.author_name = handle_usr.username;

          grp.author_email = UserUtil.getEmail(handle_usr);
          qlog.info('============> Publishing group to user - ' + JSON.stringify(grp), filename);
          self.added('user-groups', grp._id, grp);
        },
        changed : function(grp, idx) {
          var handle_usr= Meteor.users.findOne(grp.submittedBy);

          /** Need to fix the users instead of bypassing it here **/
          if(handle_usr == undefined || handle_usr.username == undefined)
            return;

          grp.author_name = handle_usr.username;

          grp.author_email = UserUtil.getEmail(handle_usr);
          qlog.info('Publishing group to user - ' + JSON.stringify(grp), filename);
          self.changed('user-groups', grp._id, grp);
        },
        removed : function(grp){
          self.removed('user-groups', grp._id);
        }
    });
		//}
		
    qlog.info('Done initializing the publisher: PUBLISH_GROUPS_OF_USER_1, uuid: ' + uuid, filename);
    initializing = false;
    self.ready();

    self.onStop(function() {
      if(handle != undefined) handle.stop();
    });
});

/** Publish all the groups that the user has subscribed to **/
Meteor.publish('USER_SUBSCRIPT_GROUPS', function() {
  var self= this;
  var gp_memberships=[];

  if (this.userId) {
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var user_email = UserUtil.getEmail(user);// user.emails[0].address;
      QollGroups.find({userEmails:user_email}, { sort : { 'submittedOn' : -1 }, reactive : true}).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(item, idx){
          //populate the group with creaters information and publish
          var owner= Meteor.users.findOne(item.submittedBy);
          var owner_email = UserUtil.getEmail(owner);
          if(owner_email && owner_email != '') {
            var g = {groupId : item._id, groupName : item.groupName, userId : owner._id, groupOwner : owner_email};
            self.added('user-subscription-groups', item._id, g);
          }
        },
        removed : function(item){
          qlog.info('Removed item with id: ' + item._id);
          self.removed('user-subscription-groups', item._id);
        }
      });
    }
  }
});


