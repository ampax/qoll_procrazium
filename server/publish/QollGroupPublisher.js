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
Meteor.publish('MY_PENDING_APPROVALS_REQ_GRP', function() {
  var self= this;
  var gp_memberships=[];

  if (this.userId) {
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var groups = user.groupsCreated;
      if(!groups) groups = [];

      var usr = Meteor.users.find({_id : this.userId}, {reactive : true}).observe({
        added : function(item, idx) {
          //qlog.info('Added user for this session - ' + JSON.stringify(item), filename);
          var groups = item.groupsCreated;
          if(!groups) groups = [];

          var group_ids = [];
          groups.map(function(group){
            group_ids.push(group.groupId);
          });

          var handle_usr_grps = Meteor.users.find({'groups.groupId' : {$in : group_ids},'groups.accessApproved' : 'pending', 'groups.groupOwner' : user._id}, {reactive : true}).observe({
            added : function(usr, idx){
              //qlog.info('Adding - ' + JSON.stringify(grp), filename);
              var grps = usr.groups;
              grps.map(function(g){
                if(g.accessApproved === 'pending') {
                  // add it to the publish pipe
                  var tg = QollGroups.findOne({_id : g.groupId});
                  var dt = {'user_name' : usr.profile.name, 'user_email' : usr.profile.email, 'user_id' : usr._id, 'access_approved' : g.accessApproved,
                              'group_name' : tg.groupName, 'group_id' : tg._id, 'group_access' : tg.groupAccess};
                  self.added('my-pending-approvals-req-group', tg._id+usr._id, dt);
                }
              });
            },
            changed : function(usr, idx){
              //qlog.info('Changing - ' + JSON.stringify(grp), filename);
              var grps = usr.groups;
              grps.map(function(g){
                if(g.accessApproved === 'pending') {
                  // add it to the publish pipe
                  var tg = QollGroups.findOne({_id : g.groupId});
                  var dt = {'user_name' : usr.profile.name, 'user_email' : usr.profile.email, 'user_id' : usr._id, 'access_approved' : g.accessApproved,
                              'group_name' : tg.groupName, 'group_id' : tg._id, 'group_access' : tg.groupAccess};
                  self.added('my-pending-approvals-req-group', tg._id+usr._id, dt);
                }
              });
            },
            removed : function(usr){
              var grps = usr.groups;
              grps.map(function(g){
                if(g.accessApproved === 'pending') {
                  // add it to the publish pipe
                  var tg = QollGroups.findOne({_id : g.groupId});
                  var dt = {'user_name' : usr.profile.name, 'user_email' : usr.profile.email, 'user_id' : usr._id, 'access_approved' : g.accessApproved,
                              'group_name' : tg.groupName, 'group_id' : tg._id, 'group_access' : tg.groupAccess};
                  self.removed('my-pending-approvals-req-group', tg._id+usr._id);
                }
              });
            }
          });
        },
        changed : function(item, idx){
          //qlog.info('Changed user for this session - ' + JSON.stringify(item), filename);

          var groups = item.groupsCreated;
          if(!groups) groups = [];

          var group_ids = [];
          groups.map(function(group){
            group_ids.push(group.groupId);
          });

          //console.log('changed ' + group_ids);

          var handle_grp = Meteor.users.find({'groups.groupId' : {$in : group_ids},'groups.accessApproved' : 'pending', 'groups.groupOwner' : user._id}, {reactive : true}).observe({
            added : function(usr, idx){
              //qlog.info('Adding - ' + JSON.stringify(grp), filename);
              var grps = usr.groups;
              grps.map(function(g){
                if(g.accessApproved === 'pending') {
                  // add it to the publish pipe
                  var tg = QollGroups.findOne({_id : g.groupId});
                  var dt = {'user_name' : usr.profile.name, 'user_email' : usr.profile.email, 'user_id' : usr._id, 'access_approved' : g.accessApproved,
                              'group_name' : tg.groupName, 'group_id' : tg._id, 'group_access' : tg.groupAccess};
                  self.added('my-pending-approvals-req-group', tg._id+usr._id, dt);
                }
              });
            },
            changed : function(usr, idx){
              //qlog.info('Changing - ' + JSON.stringify(grp), filename);
              var grps = usr.groups;
              grps.map(function(g){
                if(g.accessApproved === 'pending') {
                  // add it to the publish pipe
                  var tg = QollGroups.findOne({_id : g.groupId});
                  var dt = {'user_name' : usr.profile.name, 'user_email' : usr.profile.email, 'user_id' : usr._id, 'access_approved' : g.accessApproved,
                              'group_name' : tg.groupName, 'group_id' : tg._id, 'group_access' : tg.groupAccess};
                  self.added('my-pending-approvals-req-group', tg._id+usr._id, dt);
                }
              });
            },
            removed : function(usr){
              var grps = usr.groups;
              grps.map(function(g){
                if(g.accessApproved === 'pending') {
                  // add it to the publish pipe
                  var tg = QollGroups.findOne({_id : g.groupId});
                  var dt = {'user_name' : usr.profile.name, 'user_email' : usr.profile.email, 'user_id' : usr._id, 'access_approved' : g.accessApproved,
                              'group_name' : tg.groupName, 'group_id' : tg._id, 'group_access' : tg.groupAccess};
                  self.removed('my-pending-approvals-req-group', tg._id+usr._id);
                }
              });
            }
          });
        },
      });
      
    }
  }
});

/** Publish all the groups that the user has subscribed to **/
Meteor.publish('MY_PENDING_SUBSCRIPTIONS', function() {
  var self= this;
  var gp_memberships=[];

  if (this.userId) {
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var groups = user.groups;
      if(!groups) groups = [];

      var usr = Meteor.users.find({_id : this.userId}, {reactive : true}).observe({
        added : function(item, idx) {
          //qlog.info('Added user for this session - ' + JSON.stringify(item), filename);
          var groups = item.groups;
          if(!groups) groups = [];

          var group_ids = [];
          groups.map(function(group){
            if(group.accessApproved === 'pending') group_ids.push(group.groupId);
          });

          //console.log('added ' + group_ids);

          var handle_grp = QollGroups.find({_id : {$in : group_ids}, status : {$ne : QollConstants.STATUS.ARCHIVE}}, {reactive : true}).observe({
            added : function(grp, idx){
              //qlog.info('Adding - ' + JSON.stringify(grp), filename);
              self.added('my-pending-subscriptions', grp._id, grp);
            },
            changed : function(grp, idx){
              //qlog.info('Changing - ' + JSON.stringify(grp), filename);
              self.changed('my-pending-subscriptions', grp._id, grp);
            },
            removed : function(grp){
              self.removed('my-pending-subscriptions', grp._id);
            }
          });
        },
        changed : function(item, idx){
          //qlog.info('Changed user for this session - ' + JSON.stringify(item), filename);

          var groups = item.groups;
          if(!groups) groups = [];

          var group_ids = [];
          groups.map(function(group){
            if(group.accessApproved === 'pending') group_ids.push(group.groupId);
          });

          //console.log('changed ' + group_ids);

          var handle_grp = QollGroups.find({_id : {$in : group_ids}, status : {$ne : QollConstants.STATUS.ARCHIVE}}, {reactive : true}).observe({
            added : function(grp, idx){
              //qlog.info('Adding - ' + JSON.stringify(grp), filename);
              self.added('my-pending-subscriptions', grp._id, grp);
            },
            changed : function(grp, idx){
              //qlog.info('Changing - ' + JSON.stringify(grp), filename);
              self.changed('my-pending-subscriptions', grp._id, grp);
            },
            removed : function(grp){
              self.removed('my-pending-subscriptions', grp._id);
            }
          });
        },
      });
      
    }
  }
});

/** Publish all the groups that the user has subscribed to **/
Meteor.publish('USER_SUBSCRIPT_GROUPS', function() {
  var self= this;
  var gp_memberships=[];

  if (this.userId) {
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var groups = user.groups;
      if(!groups) groups = [];

      var usr = Meteor.users.find({_id : this.userId}, {reactive : true}).observe({
        added : function(item, idx) {
          //qlog.info('Added user for this session - ' + JSON.stringify(item), filename);
          var groups = item.groups;
          if(!groups) groups = [];

          var group_ids = [];
          var group_id_to_status = {};
          groups.map(function(group){
            group_ids.push(group.groupId);
            group_id_to_status[group.groupId] = group.accessApproved;
          });

          //console.log('added ' + group_ids);

          var handle_grp = QollGroups.find({_id : {$in : group_ids}, status : {$ne : QollConstants.STATUS.ARCHIVE}}, {reactive : true}).observe({
            added : function(grp, idx){
              //qlog.info('Adding - ' + JSON.stringify(grp), filename);
              var gru = Meteor.users.find({_id : grp.submittedBy}).fetch();
              grp.author_email = gru[0].profile.name;
              grp.accessApproved = group_id_to_status[grp._id];
              self.added('user-subscription-groups', grp._id, grp);
            },
            changed : function(grp, idx){
              //qlog.info('Changing - ' + JSON.stringify(grp), filename);
              var gru = Meteor.users.find({_id : grp.submittedBy}).fetch();
              grp.author_email = gru[0].profile.name;
              grp.accessApproved = group_id_to_status[grp._id];
              self.changed('user-subscription-groups', grp._id, grp);
            },
            removed : function(grp){
              self.removed('user-subscription-groups', grp._id);
            }
          });
        },
        changed : function(item, idx){
          //qlog.info('Changed user for this session - ' + JSON.stringify(item), filename);

          var groups = item.groups;
          if(!groups) groups = [];

          var group_ids = [];
          var group_id_to_status = {};
          groups.map(function(group){
            group_ids.push(group.groupId);
            group_id_to_status[group.groupId] = group.accessApproved;
          });

          //console.log('changed ' + group_ids);

          var handle_grp = QollGroups.find({_id : {$in : group_ids}, status : {$ne : QollConstants.STATUS.ARCHIVE}}, {reactive : true}).observe({
            added : function(grp, idx){
              //qlog.info('Adding - ' + JSON.stringify(grp), filename);
              grp.accessApproved = group_id_to_status[grp._id];
              self.added('user-subscription-groups', grp._id, grp);
            },
            changed : function(grp, idx){
              //qlog.info('Changing - ' + JSON.stringify(grp), filename);
              grp.accessApproved = group_id_to_status[grp._id];
              self.changed('user-subscription-groups', grp._id, grp);
            },
            removed : function(grp){
              self.removed('user-subscription-groups', grp._id);
            }
          });
        },
      });
      
    }
  }
});


Meteor.publish('QOLL_MY_GROUP_QUERY', function(options){
  var self = this;
  var uuid = Meteor.uuid();
  var initializing = true;
  var handle = undefined;

  qlog.info('Grouppublish; uuid: ' + uuid, filename);
  //db.QOLL.find({'submittedTo':'usr3322@qoll','action':'send'})
  if(this.userId) {//first publish specialized qolls to this user
    qlog.info('Grouppublish USERID --------->>>>>'+this.userId);

    var handle = QollGroups//.find({'submittedBy': 'TdWExitjsByuQ6gCQ', 'status' : {$ne : 'archive'}})
    .find({'submittedBy':this.userId, 'status' : {$ne : QollConstants.STATUS.ARCHIVE}}, 
      {sort : {'submittedOn' : -1}, reactive : true})
    .observe({
      added : function(grp, idx){
        var handle_usr= Meteor.users.findOne({'_id' : grp.submittedBy});
        
        /** Need to fix the users instead of bypassing it here **/
        if(handle_usr == undefined || handle_usr.slug == undefined)
          return;

        grp = extractGroupInfo(grp);
        grp.author_email = UserUtil.getEmail(handle_usr);
        grp.social_ctx = 'group-owner';
        
        //qlog.info('============> Publishing my groups to user - ' + JSON.stringify(grp), filename);
        self.added('my-groups', grp._id, grp);
      },
      changed : function(grp, idx) {
        var handle_usr= Meteor.users.findOne({'_id' : grp.submittedBy});

        /** Need to fix the users instead of bypassing it here **/
        if(handle_usr == undefined || handle_usr.slug == undefined)
          return;

        grp = extractGroupInfo(grp);
        grp.author_email = UserUtil.getEmail(handle_usr);
        grp.social_ctx = 'group-owner';
        
        //qlog.info('============> Publishing my groups to user - ' + JSON.stringify(grp), filename);
        self.changed('my-groups', grp._id, grp);
      },
      removed : function(grp){
        self.removed('my-groups', grp._id);
      }
    });

  }
    
  qlog.info('Done initializing the publisher: QOLL_MY_GROUP_QUERY, uuid: ' + uuid, filename);
  initializing = false;
  self.ready();
  
  self.onStop(function() {
    if(handle != undefined) handle.stop();
  });

});


Meteor.publish('GROUP_FOR_ID_QUERY', function(options){
  var self = this;
  var uuid = Meteor.uuid();
  var initializing = true;
  var handle;

  qlog.info('Group for ID publish; uuid: ' + uuid + ', _id: ' + options._id, filename);
  //db.QOLL.find({'submittedTo':'usr3322@qoll','action':'send'})
  if(this.userId) {//first publish specialized qolls to this user
    qlog.info('----------------------------------------------------------', filename);

    handle = QollGroups.find({_id : options._id}, {reactive : true }).observe({
      added : function(grp, idx){
        var handle_usr= Meteor.users.findOne(grp.submittedBy);

        /** Need to fix the users instead of bypassing it here **/
        if(handle_usr == undefined || handle_usr.username == undefined)
          return;

        grp = extractGroupInfo(grp);
        grp.author_email = UserUtil.getEmail(handle_usr);
        grp.author_name = UserUtil.getDisplayName(handle_usr);
        
        qlog.info('Publishing group for id to client - ' + JSON.stringify(grp), filename);
        self.added('group-for-id', grp._id, grp);
      },
      changed : function(grp, idx) {
        var handle_usr= Meteor.users.findOne(grp.submittedBy);

        /** Need to fix the users instead of bypassing it here **/
        if(handle_usr == undefined || handle_usr.username == undefined)
          return;

        grp = extractGroupInfo(grp);
        grp.author_email = UserUtil.getEmail(handle_usr);
        grp.author_name = UserUtil.getDisplayName(handle_usr);
        
        qlog.info('Publishing changed group for id to client - ' + JSON.stringify(grp), filename);
        self.changed('group-for-id', grp._id, grp);
      },
      removed : function(grp){
        self.removed('group-for-id', grp._id);
      }
    });

  }
    
  qlog.info('Done initializing the publisher: GROUP_FOR_ID_QUERY, uuid: ' + uuid, filename);
  initializing = false;
  self.ready();
  
  self.onStop(function() {
    if(handle != undefined) handle.stop();
  });

}); 


Meteor.publish('GROUP_COLLAB_ASSIGNMENTS', function(options){
  var self = this;
  var uuid = Meteor.uuid();
  var initializing = true;
  var handle;

  qlog.info('Collab-Group for ID publish; uuid: ' + uuid + ', _id: ' + options._id, filename);
  //db.QOLL.find({'submittedTo':'usr3322@qoll','action':'send'})
  if(this.userId) {//first publish specialized qolls to this user
    qlog.info('----------------------------------------------------------', filename);
    var tuid = this.userId;
    var ufound = Meteor.users.find({ "_id" : tuid }).fetch()[0];
    var collab_ids = ufound.collab_grp_ids;

    if(collab_ids) {
      handle = QollGroups.find({_id : {$in : collab_ids}}, {reactive : true }).observe({
        added : function(grp, idx){
          grp = extractGroupInfo(grp);
          qlog.info('Publishing assign-subs group for id to client (collab-groups) - ' + JSON.stringify(grp), filename);
          self.added('collab-groups', grp._id, grp);
        },
        changed : function(grp, idx) {
          grp = extractGroupInfo(grp);
          qlog.info('Publishing changed group for id to client (collab-groups) - ' + JSON.stringify(grp), filename);
          self.changed('collab-groups', grp._id, grp);
        },
        removed : function(grp){
          self.removed('collab-groups', grp._id);
        }
      });
    }

  }
    
  qlog.info('Done initializing the publisher: GROUP_COLLAB_ASSIGNMENTS, uuid: ' + uuid, filename);
  initializing = false;
  self.ready();
  
  self.onStop(function() {
    if(handle != undefined) handle.stop();
  });

}); 


var extractGroupInfo = function(item) {
  return {
    _id           : item._id,
    closedOrOpen  : item.closedOrOpen,
    createdBy     : item.createdBy,
    createdOn     : item.createdOn,
    groupDesc     : item.groupDesc,
    groupName     : item.groupName,
    groupSize     : item.groupSize,
    inviteOnly    : item.inviteOnly,
    pubOrPvt      : item.pubOrPvt,
    openOrClosed  : item.openOrClosed,
    userEmails    : item.userEmails
  };
};


Meteor.methods({
  fetch_group_for_ids : function(ids) {
    var qg = QollGroups.find({_id : {$in : ids}}).fetch();
    return qg;
  },
  fetch_my_groups: function(query){

        qlog.info("Getting groups for my-groups in QueryXYXYXYXYXYXYXXYXYXYXYXYX====: " + query, filename);
        
        if(query.search(/,/) != -1) {
          var query = split(query);
          query = query[query.length-1];
        }
        
        var results = new Array();

        // results.push({'tag' : query});

        if(query != '') {
          var grps = QollGroups.find({'submittedBy':this.userId, 'status' : {$ne : QollConstants.STATUS.ARCHIVE},
                            'groupName': {$regex: '^.*'+query+'.*$', $options: 'i'}}).fetch();
          // var tags = QollTags.find({'groupName': {$regex: '^.*'+query+'.*$', $options: 'i'}} ).fetch();
          grps.forEach(function(t){
            qlog.info('GroupXXXXXXYYYYYYYYVVVVVVBBBBBB ---------->' + JSON.stringify(t));
            //results.push({'group_name' : t.groupName, 'group_desc' : t.groupDesc, 'group_id' : t._id, 'group_ref' : t.groupName + '('+t.groupDesc+')' });
            results.push({'name': t.groupName, 'group_name' : t.groupName, 'group_desc' : t.groupDesc, 'group_id' : t._id, 'group_ref' : t.groupName + '('+t.groupDesc+', ID: '+ t._id +')' });
          });
        }

        qlog.info('Group ==========--==>' + JSON.stringify(results), filename);

        /** 
        results.push({'tag' : 'dummy1'});
        results.push({'tag' : 'dummy2'});
        results.push({'tag' : 'dummy3'}); 
        **/

        return results;
    },
    assignDefaultCollabGroup: function(group_names) {
      var grps = QollGroups.find({'submittedBy':this.userId, 'groupDesc' : {$in : group_names}}).fetch();

      var ufound = Meteor.users.find({"_id" : this.userId }).fetch();
      var collab_grp_ids = new Array();

      if(grps && grps.length > 0) {
        grps.forEach(function(g){
          g.collab_group = true;
          QollGroups.update({_id : g._id}, g);

          collab_grp_ids.push(g._id);
        });

        qlog.info('Updating user with collab-group-ds - ' + collab_grp_ids, filename);

        //var profile = ufound.profile;
        //profile.collab_grp_ids = collab_grp_ids

        Meteor.users.update({_id : Meteor.userId()}, 
          {$set : {'profile.collab_grp_ids' : collab_grp_ids, 'collab_grp_ids' : collab_grp_ids}});
      }
    }
});

var split = function(val){
  return val.split( /,\s*/ );
};


