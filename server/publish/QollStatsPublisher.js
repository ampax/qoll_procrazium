var filename = 'server/publish/QollStatsPublisher.js';

Meteor.publish("QOLL_DETAILS_BY_ID", function(qid){
  var self = this;
  var uuid = Meteor.uuid();
  var initializing = true;
  
  qlog.info('In QOLL_DETAILS_BY_ID for: ' + qid, filename);

  var handle = QollRegister.find({qollId : qid}).observe({
    added: function(doc, idx){
      qlog.info('item added---------------: ' + JSON.stringify(doc));
      if(!initializing)
        self.added("qoll-details-by-id", doc._id, doc);
    },
    removed: function(doc){
      self.removed("qoll-details-by-id", doc._id);
    },
    changed: function(doc, idx){
      qlog.info('changed item-------------: ' + JSON.stringify(doc));
      self.changed('qoll-details-by-id', doc._id, doc);
    }
  });

  qlog.info('Done initializing the publisher: QOLL_DETAILS_BY_ID, uuid: ' + uuid, filename);
  initializing = false;
  self.ready();
  //self.flush();

  self.onStop(function(){
    handle.stop();
  });
});


Meteor.publish("QOLL_STATS_BY_ID", function(qid){
  var self = this;
  var uuid = Meteor.uuid();
  var initializing = true;
  var data = {};

  //self.unset('qoll-stats-by-id', qid, ['data']);

  var query = QollRegister.find({qollId : qid});
  var handle = query.observe({
    added: function(doc, idx){
      qlog.info('item/stats added---------------: ' + JSON.stringify(doc), filename);
      if(!(doc.qollTypeVal in data)){
        data[doc.qollTypeVal] = 0;
      }
      data[doc.qollTypeVal] += 1;

      if(!initializing)
        self.added("qoll-stats-by-id", qid,  {'data' : data});
    },
    changed: function(doc, idx){
      qlog.info('changed item/stats-------------: ' + JSON.stringify(doc));
      if(!(doc.qollTypeVal in data)){
        data[doc.qollTypeVal] = 0;
      }
      data[doc.qollTypeVal] += 1;

      self.changed('qoll-stats-by-id', qid, {'data' : data});
    }
  });
  
  /**var handle = QollRegister.aggregate([
      {'$match' : {qollId : qid}},
      {'$group' : {'_id' : '$qollTypeVal', 'qolls' : { '$push' : {'qollTypeVal' : '$qollTypeVal'}},'value' : {'$sum' : 1}}},
      {'$project' : {'_id' : '$_id', 'qolls' : '$qolls', 'value' : '$value'}}
  ]);**/
  qlog.info('Found the item/stats::::: ' + JSON.stringify(data));
  qlog.info('Done initializing the publisher: QOLL_STATS_BY_ID, uuid: ' + uuid, filename);
  initializing = false;
  self.added("qoll-stats-by-id", qid,  {'data' : data});
  self.ready();
  //self.flush();
  Deps.flush();

  self.onStop(function(){
    handle.stop();
  });
});

Meteor.publish("ALL_STATS", function(){
  var uuid = Meteor.uuid();
  qlog.info('Done initializing the publisher: ALL_STATS, uuid: ' + uuid, filename);
  var handle = QollRegister.find({});
  return handle;
});