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