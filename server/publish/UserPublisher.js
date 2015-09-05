var filename="server/publish/UserPublisher.js";

Meteor.publish('ALL_CONTACT_CARDS', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Fetching all the contacts; uuid: ' + uuid, filename);

        var handle = Usr.all();
        handle.observe({
        	added: function(doc, idx) {
        		self.added('all-contact-cards', doc._id, doc);
        	}
        });

        initializing = false;
        self.ready();
		self.onStop(function(){
                handle.stop();
        });
});


var privacyOptions = { // false means private
  secret_id: false,
  isAdmin: false,
  emails: false,
  notifications: false,
  inviteCount: false,
  'profile.email': false,
  'services.twitter.accessToken': false,
  'services.twitter.accessTokenSecret': false,
  'services.twitter.id': false,
  'services.password': false,
  'services.resume': false
};

//publish current user
Meteor.publish('currentUser1', function() {
  var user = Meteor.users.findOne(this.userId);

  if(!user || user == undefined) return;

  var self= this;
  var user_email =UserUtil.getEmail(user);// user.emails[0].address;
  var gp_memberships=[];

  qlog.info('Printing theu ser from currentUser ----------> ' + JSON.stringify(user), filename);
  
  
  QollGroups.find({userEmails:user_email}).forEach(function (val){
    
    var owner= Meteor.users.findOne(val.submittedBy);
    if(owner){
      gp_memberships.push({groupName:val.groupName,groupOwner:UserUtil.getEmail(owner)});
    }
  });
  
  user.groupMemberships = gp_memberships;

  qlog.info('Printing theu ser from currentUser ----------> ' + JSON.stringify(user) + '/' + gp_memberships, filename);
  
  self.added('currentUserData',this.userId,user);
});

// Publish a single user

Meteor.publish('singleUser', function(userIdOrSlug) {
  if(PermUtil.canViewById(this.userId)){
    var options = UserUtil.isAdminById(this.userId) ? {limit: 1} : {limit: 1, fields: privacyOptions};
    var findById = Meteor.users.find(userIdOrSlug, options);
    var findBySlug = Meteor.users.find({slug: userIdOrSlug}, options);

    // if we find something when treating the argument as an ID, return that; else assume it's a slug
    return findById.count() ? findById : findBySlug;
  }
  return [];
});

Meteor.publish('allUsers', function(filterBy, sortBy, limit) {
  if(PermUtil.canViewById(this.userId)){
    var parameters = getUsersParameters(filterBy, sortBy, limit);
    if (!isAdminById(this.userId)) // if user is not admin, filter out sensitive info
      parameters.options = _.extend(parameters.options, {fields: privacyOptions});
    return Meteor.users.find(parameters.find, parameters.options);
  }
  return [];
});




/*
Sample -
(1) Google  
{   name: 'Amit Kaushik',
  email: 'kaushik.amit@gmail.com',
  photoUrl: 'https://www.google.com/m8/feeds/photos/media/procrazium%40gmail.com/2f202ab00f7a85a2',
  mime_type: 'image/*' 
}

(2) Facebook
{
  "id":"100004286557312",
  "gender":"male",
  "last_name":"Khandelwal",
  "first_name":"Ajay",
  "locale":"en_US",
  "username":"ajay.khandelwal.142892"
}
*/
Meteor.publish('allFriends', function() { //filterBy, sortBy, limit
  var self=this;
  qlog.info('Fetching friends for user-id - ' + this.userId, filename);
  //if(PermUtil.canViewById(this.userId)){
    var friends = new Array();
    var sfrnds = SocialFriends.find({user_id : this.userId, active : 1});
    //qlog.info('All friends - ' + JSON.stringify(sfrnds), filename);
    if(sfrnds != undefined) {
      sfrnds.map(function(sf){
        qlog.info('Iterating over friends data - ' + sf.friend_id, filename);
        var contact = SocialConnect.findOne({_id : sf.friend_id, active : 1});
        qlog.info('Printing the friend found - ' + JSON.stringify(contact), filename);
        if(contact) {
          var tmp = {};
          //Got active contact from SocialConnect. That means the user is not part of Qoll yet. 
          //Push it on the contacts array and publish.
          qlog.info('----------------------*' + contact.social_type + '*----------------------');
          if(contact.social_type === 'facebook') {
            qlog.info('initializing facebook contact - ' + contact.first_name + ' ' 
              + contact.last_name + ' ' + contact.gender, filename);
            tmp['name'] = contact.first_name + ' ' + contact.last_name;
            tmp['gender'] = contact.gender;
          } else if(contact.social_type === 'google') {
            qlog.info('initializing google contact - ' + contact.name + ' ' + contact.email, filename);
            tmp['name'] = contact.name;
            tmp['email'] = contact.email;
            tmp['photoUrl'] = contact.photoUrl;
          }
          friends.push(tmp);
          //if(contact.social_type )
        } else {
          //Did not get active contact from SocialConnect. That means the user has become part of the Qoll. 
          //Query further qoll users
        }
      });
      qlog.info('----===============>>>>>> ' + JSON.stringify(friends), filename);
      self.added('allFriends', this.userId, friends);
      //return friends;
    } else {
        //return Meteor.users.find(parameters.find, parameters.options);
      //}

    //return [];
    }
    self.ready();
});


Meteor.publish('ALL_FRIENDS', function() {
  var self= this;
  var uuid = Meteor.uuid();

  if (this.userId) {
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var user_email = UserUtil.getEmail(user);// user.emails[0].address;
      SocialFriends.find({ user_id : this.userId, active : 1 }, { reactive : true }).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(contact, idx){
          //populate the group with creaters information and publish
          var connect= SocialConnect.findOne({_id : contact.friend_id});
          connect = collectContactInfo(connect);
          connect.social_ctx = 'my_social';
          //qlog.info('Pushing connect to the client - ' + JSON.stringify(connect), filename);
          self.added('all-my-friends', connect._id, connect);
        },
        changed : function(contact, idx){
          //populate the group with creaters information and publish
          var connect= SocialConnect.findOne({_id : contact.friend_id});
          connect = collectContactInfo(connect);
          connect.social_ctx = 'my_social';
          //qlog.info('Pushing connect to the client - ' + JSON.stringify(connect), filename);
          self.changed('all-my-friends', connect._id, connect);
        },
        removed : function(contact){
          var connect= SocialConnect.findOne({_id : contact.friend_id});
          qlog.info('Removed connect-item with id: ' + connect._id);
          self.removed('all-my-friends', connect._id);
        }
      });
    }
  }

  qlog.info('Done initializing the new-friends: ALL_FRIENDS, uuid: ' + uuid, filename);
});


Meteor.publish('ALL_QOLL_USERS', function() {
  var self= this;
  var uuid = Meteor.uuid();

  if (this.userId) {
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      
      Meteor.users.find({}).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(quser, idx){
          //populate the user and publish
          quser = collectQollUserInfo(quser);
          var qoll_friend = QollFriends.findOne({user_id : user._id, friend_id : quser._id});
          quser.social_ctx = 'social-qoll-user';

          if(qoll_friend) {
            quser.friend_request_status = qoll_friend.status;
            quser.friend_request_initiated_on = qoll_friend.initiated_on;
            quser.social_ctx = 'social-qoll-user-req-sent';
          }

          qlog.info('Publishing connect to client - ' +user._id + '////' + JSON.stringify(quser), filename);

          if(qoll_friend && qoll_friend.status != QollConstants.STATUS.CONFIRMED || !qoll_friend) {
            self.added('all-qoll-users', quser._id, quser);
          }
        },
        changed : function(quser, idx){
          quser = collectQollUserInfo(quser);
          var qoll_friend = QollFriends.findOne({user_id : user._id, friend_id : quser._id});
          quser.social_ctx = 'social-qoll-user';

          if(qoll_friend) {
            quser.friend_request_status = qoll_friend.status;
            quser.friend_request_initiated_on = qoll_friend.initiated_on;
            quser.social_ctx = 'social-qoll-user-req-sent';
          }

          qlog.info('Publishing connect to client - ' + JSON.stringify(quser), filename);

          if(qoll_friend && qoll_friend.status != QollConstants.STATUS.CONFIRMED || !qoll_friend) {
            self.changed('all-qoll-users', quser._id, quser);
          }
        },
        removed : function(quser){
          self.removed('all-qoll-users', quser._id);
        }
      });
    }
  }

  qlog.info('Done initializing the qoll-users: ALL_QOLL_USERS, uuid: ' + uuid, filename);
});

Meteor.publish('MY_QOLL_CONNECTS', function() {
  var self= this;
  var uuid = Meteor.uuid();

  if (this.userId) { 
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var user_email = UserUtil.getEmail(user);// user.emails[0].address;

      qoll_friend = QollFriends.find({user_id : user._id, status : QollConstants.STATUS.CONFIRMED}, { reactive : true }).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(contact, idx){
          //populate the group with creaters information and publish
          var connect= Meteor.users.findOne({_id : contact.friend_id});
          connect = collectQollUserInfo(connect);

          connect.friend_request_status = contact.status;
          connect.friend_request_initiated_on = contact.initiated_on;
          connect.social_ctx = 'my-social-connects';

          qlog.info('Pushing qoll-connect to the client - ' + JSON.stringify(connect), filename);
          self.added('my-qoll-connects', connect._id, connect);
        },
        changed : function(contact, idx){
          //populate the group with creaters information and publish
          var connect= Meteor.users.findOne({_id : contact.friend_id});
          connect = collectQollUserInfo(connect);

          connect.friend_request_status = contact.status;
          connect.friend_request_initiated_on = contact.initiated_on;
          connect.social_ctx = 'my-social-connects';

          qlog.info('Pushing qoll-connect to the client - ' + JSON.stringify(connect), filename);
          self.changed('my-qoll-connects', connect._id, connect);
        },
        removed : function(contact){
          qlog.info('Removed connect-item with id: ' + contact.friend_id);
          self.removed('my-qoll-connects', contact.friend_id);
        }
      });
    }
  }

  qlog.info('Done initializing the qoll-friends: MY_QOLL_CONNECTS, uuid: ' + uuid, filename);
});

Meteor.publish('MY_QOLL_CONNECTS_OP_REQS', function() {
  var self= this;
  var uuid = Meteor.uuid();

  if (this.userId) { 
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var user_email = UserUtil.getEmail(user);// user.emails[0].address;

      //sent requests
      qoll_friend = QollFriends.find({user_id : user._id, status : QollConstants.STATUS.PENDING}, { reactive : true }).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(contact, idx){
          //populate the group with creaters information and publish
          var connect= Meteor.users.findOne({_id : contact.friend_id});
          connect = collectQollUserInfo(connect);

          connect.friend_request_status = contact.status;
          connect.friend_request_initiated_on = contact.initiated_on;
          connect.is_receiver = true;
          connect.social_ctx = 'my-qoll-connects-open-reqs';

          qlog.info('Pushing my-qoll-connects-open-reqs to the client - ' + JSON.stringify(connect), filename);
          self.added('my-qoll-connects-open-reqs', connect._id, connect);
        },
        changed : function(contact, idx){
          //populate the group with creaters information and publish
          var connect= Meteor.users.findOne({_id : contact.friend_id});
          connect = collectQollUserInfo(connect);

          connect.friend_request_status = contact.status;
          connect.friend_request_initiated_on = contact.initiated_on;
          connect.is_receiver = true;
          connect.social_ctx = 'my-qoll-connects-open-reqs';

          qlog.info('Pushing my-qoll-connects-open-reqs to the client - ' + JSON.stringify(connect), filename);
          self.changed('my-qoll-connects-open-reqs', connect._id, connect);
        },
        removed : function(contact){
          qlog.info('Removed my-qoll-connects-open-reqs with id: ' + contact.friend_id);
          self.removed('my-qoll-connects-open-reqs', contact.friend_id);
        }
      });

      //received requests
      qoll_friend_rec = QollFriends.find({friend_id : user._id, status : QollConstants.STATUS.PENDING}, { reactive : true }).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(contact, idx){
          //populate the group with creaters information and publish
          var connect= Meteor.users.findOne({_id : contact.user_id});
          connect = collectQollUserInfo(connect);

          connect.friend_request_status = contact.status;
          connect.friend_request_initiated_on = contact.initiated_on;
          connect.is_receiver = false;
          connect.social_ctx = 'my-qoll-connects-open-rec-reqs';

          qlog.info('Pushing my-qoll-connects-open-rec-reqs to the client - ' + JSON.stringify(connect), filename);
          self.added('my-qoll-connects-open-rec-reqs', connect._id, connect);
        },
        changed : function(contact, idx){
          //populate the group with creaters information and publish
          var connect= Meteor.users.findOne({_id : contact.user_id});
          connect = collectQollUserInfo(connect);

          connect.friend_request_status = contact.status;
          connect.friend_request_initiated_on = contact.initiated_on;
          connect.is_receiver = false;
          connect.social_ctx = 'my-qoll-connects-open-rec-reqs';

          qlog.info('Pushing my-qoll-connects-open-rec-reqs to the client - ' + JSON.stringify(connect), filename);
          self.changed('my-qoll-connects-open-rec-reqs', connect._id, connect);
        },
        removed : function(contact){
          qlog.info('Removed my-qoll-connects-open-reqs with id: ' + contact.friend_id);
          self.removed('my-qoll-connects-open-rec-reqs', contact.user_id);
        }
      });
    }
  }

  qlog.info('Done initializing the qoll-friends: MY_QOLL_CONNECTS, uuid: ' + uuid, filename);
});


Meteor.publish('MEMBERS_FOR_GROUP_ID_1', function(options) {
  var self= this;
  var uuid = Meteor.uuid();

  if (this.userId) { 
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var user_email = UserUtil.getEmail(user);// user.emails[0].address;

      var grp = QollGroups.findOne({_id : options._id})
      var userEmails = grp.userEmails;

      var userIds = [];
      userEmails.map(function(email){
        var user=Meteor.users.findOne({ "profile.email" : email });
        if(!user) {
            user=Meteor.users.findOne({ "emails.address" : email });
        }

        userIds.push(user._id);
      })

      Meteor.users.find({_id : {$in : userIds}}).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(quser, idx){
          //populate the user and publish
          quser = collectQollUserInfo(quser);
          quser.social_ctx = options.ctx;
          quser.ctx = options.ctx;

          qlog.info('Publishing connect to client - ' +user._id + '////' + JSON.stringify(quser), filename);

          self.added('members-for-group-id', quser._id, quser);
        },
        changed : function(quser, idx){
          quser = collectQollUserInfo(quser);
          quser.social_ctx = options.ctx;
          quser.ctx = options.ctx;
          
          qlog.info('Publishing connect to client - ' + JSON.stringify(quser), filename);

          self.changed('members-for-group-id', quser._id, quser);
        },
        removed : function(quser){
          self.removed('members-for-group-id', quser._id);
        }
      });
    }
  }

  qlog.info('Done initializing the members-for-group-id: MEMBERS_FOR_GROUP_ID, uuid: ' + uuid, filename);
});

Meteor.publish('MEMBERS_FOR_GROUP_ID', function(options) {
  var self= this;
  var uuid = Meteor.uuid();

  if (this.userId) { 
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      var user = ufound[0];
      var user_email = UserUtil.getEmail(user);// user.emails[0].address;

      //var grp = 
      QollGroups.find({_id : options._id}, { reactive : true }).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(grp, idx){
          var userEmails = grp.userEmails;

          var userIds = [];
          userEmails.map(function(email){
            var user=Meteor.users.findOne({ "profile.email" : email });
            if(!user) {
                user=Meteor.users.findOne({ "emails.address" : email });
            }

            if(user) userIds.push(user._id);
          })

          var usrs = Meteor.users.find({_id : {$in : userIds}});

          usrs.map(function(quser){
            //populate the user and publish
            quser = collectQollUserInfo(quser);
            quser.social_ctx = options.ctx;
            quser.ctx = options.ctx;

            qlog.info('Publishing connect to client - ' +quser._id + '////' + JSON.stringify(quser), filename);

            self.added('members-for-group-id', quser._id, quser);
          });
        },
        changed : function(grp, idx){
          var userEmails = grp.userEmails;

          var userIds = [];
          userEmails.map(function(email){
            var user=Meteor.users.findOne({ "profile.email" : email });
            if(!user) {
                user=Meteor.users.findOne({ "emails.address" : email });
            }

            if(user) userIds.push(user._id);
          })

          var usrs = Meteor.users.find({_id : {$in : userIds}});

          usrs.map(function(quser){
            //populate the user and publish
            quser = collectQollUserInfo(quser);
            quser.social_ctx = options.ctx;
            quser.ctx = options.ctx;

            qlog.info('Publishing connect to client - ' +quser._id + '////' + JSON.stringify(quser), filename);

            self.changed('members-for-group-id', quser._id, quser);
          });
        },
        removed : function(grp){
          var userEmails = grp.userEmails;

          var userIds = [];
          userEmails.map(function(email){
            var user=Meteor.users.findOne({ "profile.email" : email });
            if(!user) {
                user=Meteor.users.findOne({ "emails.address" : email });
            }

            if(user) userIds.push(user._id);
          })

          var usrs = Meteor.users.find({_id : {$in : userIds}});

          usrs.map(function(quser){
            //populate the user and publish
            quser = collectQollUserInfo(quser);
            quser.social_ctx = options.ctx;
            quser.ctx = options.ctx;

            qlog.info('Removing connect from the client - ' +quser._id + '////' + JSON.stringify(quser), filename);

            self.removed('members-for-group-id', quser._id);
          });
        }
      });
    }
  }

  qlog.info('Done initializing the members-for-group-id: MEMBERS_FOR_GROUP_ID, uuid: ' + uuid, filename);
});


var collectContactInfo = function(connect) {
  
  if(connect.social_type === 'facebook') {
    qlog.info('initializing facebook connect - ' + connect.first_name + ' ' 
      + connect.last_name + ' ' + connect.gender, filename);
    connect['name'] = connect.first_name + ' ' + connect.last_name;
    connect['email'] = '<not-provided@email.com>';
  } 

  return connect;
};

var collectQollUserInfo = function(user) {
  return {
    _id           :   user._id,
    createdAt     :   user.createdAt,
    groups        :   user.groups,
    groupsCreated :   user.groupsCreated,
    facebook      :   user.profile.facebook,
    google        :   user.profile.google,
    twitter       :   user.profile.twitter,
    email         :   user.profile.email,
    name          :   user.profile.name,
    name_slug     :   user.profile.name_slug,
    slug          :   user.profile.slug,
    sex           :   user.profile.sex,
    social_type   :   'qoll',
  };
};


Meteor.methods({
  fetch_my_emails: function(query){
        qlog.info("Getting emails of all friends for: " + Meteor.userId() + ", Query: " + query, filename);
        if(query.search(/,/) != -1) {
          var query = split(query);
          query = query[query.length-1];
        }
        qlog.info('Extracted query string from multiple is - ' + query, filename);

        var results = new Array();
        var user_id = Meteor.userId();

        var friend_ids = new Array();

        // Finding all the Qoll-Friends for this user
        var qoll_friend = QollFriends.find({user_id : Meteor.userId(), status : QollConstants.STATUS.CONFIRMED}, {friend_id : 1}).fetch();
        var qoll_friend_ids = new Array();
        qoll_friend.forEach(function(qf){
          qoll_friend_ids.push(qf.friend_id);
        });
        // qlog.info('Qoll friends ids: ' + qoll_friend_ids, filename);
        if(query != '') {
          var user_emails = Meteor.users.find({'profile.name': {$regex: '^.*'+query+'.*$', $options: 'i'}, _id : {$in : qoll_friend_ids}}, 
            {'profile.name' : 1, 'profile.email' : 1}).fetch();

          user_emails.forEach(function(ue){
            //qlog.info('Email for qoll connect is =======> ' + JSON.stringify(ue), filename);
            results.push({'name' : ue.profile.name, 'email' : ue.profile.email});
          });
        }

        // Fetching all the Social-Friends for this user ( if there are any pulled from soc-networking-portals)
        var soc_friend = SocialFriends.find({user_id : Meteor.userId(), active : 1}, {friend_id : 1});
        var soc_friend_ids = new Array();
        soc_friend.forEach(function(qf){
          soc_friend_ids.push(qf.friend_id);
        });
        //qlog.info('Social friends ids: ' + JSON.stringify(soc_friend_ids), filename);
        if(query != '') {
          var user_emails = SocialConnect.find({'name': {$regex: '^.*'+query+'.*$', $options: 'i'}, _id : {$in : soc_friend_ids}}, 
            {'name' : 1, 'email' : 1}).fetch();

          //qlog.info('Social user data: ' + user_emails, filename);

          user_emails.forEach(function(ue){
            // qlog.info('Email for social connect is =======> ' + JSON.stringify(ue), filename);
            results.push({'name' : ue.name, 'email' : ue.email});
          });
        }

        // push user groups here
        // QollGroups.find({'submittedBy':this.userId},{fields:{"_id": 1,'groupName':1,'submittedBy':2}});
        if(query != '') {
          var user_groups = QollGroups.find({'groupName': {$regex: '^.*'+query+'.*$', $options: 'i'}, 'submittedBy':this.userId}, 
            {"_id": 1,'groupName':1,'submittedBy':2}).fetch();

          //qlog.info('Social user data: ' + user_emails, filename);

          user_groups.forEach(function(gp){
            // qlog.info('Email for social connect is =======> ' + JSON.stringify(ue), filename);
            results.push({'name' : gp.groupName, 'email' : gp.groupName});
          });
        }

        // qlog.info('Result till this point - ' + JSON.stringify(results), filename);

        results.push({'name' : 'dummy1', 'email' : 'dummy1@gmail.com'});
        results.push({'name' : 'dummy2', 'email' : 'dummy2@gmail.com'});
        results.push({'name' : 'dummy3', 'email' : 'dummy3@gmail.com'});

        return results;
    },
});

var split = function(val){
  return val.split( /,\s*/ );
};

