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
Meteor.publish('currentUser', function() {
  var user = Meteor.users.findOne(this.userId);
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