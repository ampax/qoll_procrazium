var filename="server/publish/QollShareCirclePublisher.js";

Meteor.publish('ALL_SHARE_CIRCLES_ASSIGN', function() {
  var self= this;
  var uuid = Meteor.uuid();

  if (this.userId) {
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      QollShareCircleAssign.find({}, { reactive : true }).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(qsca, idx){
          self.added('all-share-circle-assign', qsca._id, qsca);
        },
        changed : function(qsca, idx){
          self.changed('all-share-circle-assign', qsca._id, qsca);
        },
        removed : function(qsca){
          self.removed('all-share-circle-assign', qsca._id);
        }
      });
    }
  }

  qlog.info('Done initializing the new-share-circle: ALL_SHARE_CIRCLES_ASSIGN, uuid: ' + uuid, filename);
});

Meteor.publish('ALL_SHARE_CIRCLES', function() {
  var self= this;
  var uuid = Meteor.uuid();

  if (this.userId) {
    var ufound = Meteor.users.find({"_id" : this.userId}).fetch();
    if (ufound.length > 0) {
      QollShareCircle.find({}, { reactive : true }).observe({
        //Publish all the groups in the order in which they change and all, deleted should be removed from the users and
        //every addition, update should be added to the list
        added : function(qsca, idx){
          self.added('all-share-circle', qsca._id, qsca);
        },
        changed : function(qsca, idx){
          self.changed('all-share-circle', qsca._id, qsca);
        },
        removed : function(qsca){
          self.removed('all-share-circle', qsca._id);
        }
      });
    }
  }

  qlog.info('Done initializing the new-share-circle: ALL_SHARE_CIRCLES, uuid: ' + uuid, filename);
});

Meteor.methods({
	assign_share_circle: function(share_circles, emails) {

    emails.forEach(function(email){
      //console.log(email);
      //qlog.info('Assigning 1 - {' + share_circles + '/' + email + '}', filename);
        var user=Meteor.users.findOne({ "profile.email" : email });
        // qlog.info(JSON.stringify(user), filename);
        if(!user) {
          //qlog.info('Assigning 2 - {' + share_circles + '/' + email + '}', filename);
            // user=Meteor.users.findOne({ "emails.address" : email });
            user=Meteor.users.findOne({ emails: { $elemMatch: { address:  email } } });
            // user = Accounts.findUserByEmail(email);
        }

        //qlog.info(JSON.stringify(user), filename);

        // if user found, assign share_circle to the user profile
        // make an entry in a separate table to keep a log of shared circlers

      if(user) {
          qlog.info('Fetched user with email - ' + email, filename);

          if(!user.share_circle) {
              user.share_circle = [];
          }

          var share_circle_length = user.share_circle.length;

          share_circles.forEach(function(share_circle){
            if(_.indexOf(user.share_circle, share_circle) == -1) {
              user.share_circle.push(share_circle);
            }
          });

          if(share_circle_length != user.share_circle.length) {
            Meteor.users.update({ "emails.address" : email }, {$set: {share_circle : user.share_circle}}, function(error){
                if(error){
                    qlog.error('Error happened while pushing share_circle for user: ' + user._id + ', share_circle: ' + share_circle + ', ERROR: ' + error, filename);
                } else {
                    qlog.info('======================>  Done pushing share_circle: ' + share_circles + ' for email: ' + email, filename);

                    // now insert the assignments in QollShareCircleAssign
                    share_circles.forEach(function(share_circle){
                      var qsca = QollShareCircleAssign.find({user_id : user._id, share_circle : share_circle }).fetch();
                      qlog.info('==================> '+JSON.stringify(qsca), filename);

                      if(!qsca || qsca.length == 0) {
                        var qs = QollShareCircle.findOne({share_circle : share_circle});
                        QollShareCircleAssign.insert({user_id : user._id, name : user.profile.name, email : email, share_circle : share_circle, share_circle_id : qs._id });
                      }
                    });
                }
            });
          }
      }
    });

	},
    fetch_all_share_circles: function(query){
        qlog.info("Getting All Users: " + query, filename);
        if(query.search(/,/) != -1) {
          var query = split(query);
          query = query[query.length-1];
        }
        qlog.info('Extracted all-user-email query string - ' + query, filename);

        var results = new Array();

        if(query != '') {
          var circles = QollShareCircle.find( {'share_circle': {$regex: '^.*'+query+'.*$', $options: 'i'}} ).fetch();

          circles.forEach(function(sc){
              
              results.push({ 'share_circle' : sc.share_circle, 'description' : sc.description });

          });
        }

        /**results.push({'name' : 'dummy1', 'email' : 'dummy1@gmail.com', 'group_name' : 'Dummy Group 1', 'group_id' : 'Dummy Id 1'});
        results.push({'name' : 'dummy2', 'email' : 'dummy2@gmail.com', 'group_name' : 'Dummy Group 2', 'group_id' : 'Dummy Id 2'});
        results.push({'name' : 'dummy3', 'email' : 'dummy3@gmail.com', 'group_name' : 'Dummy Group 3', 'group_id' : 'Dummy Id 3'});**/

        return results;
    },
});