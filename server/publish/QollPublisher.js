var filename = 'server/publisher/QollPublisher.js';

/** Publishing to the subscribers method for qolls  **/
Meteor.publish('All_QOLL_PUBLISHER', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Fetching all the qolls in desc order of creation; uuid: ' + uuid, filename);
        var handle = Qoll.find().observe({
          added: function(doc, idx) {
            Qoll.find({}, {sort:{'submittedOn':-1}, reactive:true}).forEach(function(item){
              var qtype = QollTypeStandard.findOne({_id : item.qollType});
              var q = {
                qollText : item.qollText,
                submittedOn : item.submittedOn,
                submittedBy : item.submittedBy,
                submittedTo : item.submittedTo,
                qollType : qtype.qollType,
                _id : item._id
              };
              self.added('all-qolls', item._id, q);
              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(qtype));
              //qlog.info('Adding another qoll --------->>>>>'+JSON.stringify(q));
            });
          },
          /**removed: function(item) {
            self.removed('all-qolls', item._id);
            qlog.info('Removed item with id: ' + item._id);
          }**/
        });

        qlog.info('Done initializing the publisher: All_QOLL_PUBLISHER, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();
        //self.flush();

        self.onStop(function(){
                handle.stop();
        });
}); 