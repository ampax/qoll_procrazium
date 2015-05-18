var filename='server/publish/QollImagePublisher.js';

/**
Meteor.publish("QOLL_IMAGES", function(){
  var self = this;
  var uuid = Meteor.uuid();
  var initializing = true;
  
  qlog.info('=======> QOLL_IMAGES <======', filename);

  var handle = QollImages.find({}, {reactive : true}).observe({
    added: function(doc, idx){
      qlog.info('Publishing the qoll image - ' + JSON.stringify(doc));
      //if(!initializing)
      self.added("qoll-images", doc._id, doc);
    },
    removed: function(doc){
      self.removed("qoll-images", doc._id);
    },
    changed: function(doc, idx){
      qlog.info('changed qoll type-val for item-------------: ' + JSON.stringify(doc));
      self.changed('qoll-images', doc._id, doc);
    }
  });

  qlog.info('Done initializing the publisher: QOLL_IMAGES, uuid: ' + uuid, filename);
  initializing = false;
  self.ready();
  //self.flush();

  self.onStop(function(){
    handle.stop();
  });

  //return QollImages.find();
});
**/

Meteor.publish('images', function() {
  qlog.info('Received publish image from ionic (probably)', filename);

  console.log(QollImages.find().fetch());

  return QollImages.find();
});

Meteor.publish('images_cluster', function() {
  qlog.info('Received publish image from ionic (probably)', filename);
  return QollImages.find();
});

Meteor.methods({
  images_for_ids : function(img_ids) {
    qlog.info('Received request for images for ids - ' + img_ids, filename);
    var imgs_found = QollImages.find({'_id': {$in: img_ids}}).fetch();
    qlog.info('=====================> ' + imgs_found);
    return imgs_found;
  },
});