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
  
  
  QollGroups.find({userEmails:user_email}).forEach(function (val){
  	
  	var owner= Meteor.users.findOne(val.submittedBy);
  	if(owner){
  		gp_memberships.push({groupName:val.groupName,groupOwner:UserUtil.getEmail(owner)});
  		
  	}
  });
  
  user.groupMemberships = gp_memberships;
  
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
  if(canViewById(this.userId)){
    var parameters = getUsersParameters(filterBy, sortBy, limit);
    if (!isAdminById(this.userId)) // if user is not admin, filter out sensitive info
      parameters.options = _.extend(parameters.options, {fields: privacyOptions});
    return Meteor.users.find(parameters.find, parameters.options);  
  }
  return [];
});