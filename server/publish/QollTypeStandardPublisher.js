var filename = 'server/publish/QollTypeStandardPublisher.js';

Meteor.publish('ALL_QOLL_TYPE_STANDARD', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Fetching all the qoll types; uuid: ' + uuid, filename);
        var handle = QollTypeStandard.find().observe({
          added: function(doc, idx) {
            QollTypeStandard.find().forEach(function(item){
              self.added('standard-qoll-types', item._id, item);
              //qlog.info('type added---------------: ' + JSON.stringify(item), filename);
            });
          }
        });

        qlog.info('Done initializing the publisher: ALL_QOLL_TYPE_STANDARD, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();

        self.onStop(function(){
                handle.stop();
        });
});