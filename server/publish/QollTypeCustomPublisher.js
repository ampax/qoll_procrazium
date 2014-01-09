var filename = 'server/publish/QollTypeCustomPublisher.js';

Meteor.publish('ALL_QOLL_TYPE_CUSTOM', function(){
        var self = this;
        var uuid = Meteor.uuid();
        var initializing = true;

        qlog.info('Fetching all the qoll types; uuid: ' + uuid, filename);
        var handle = QollTypeCustom.find({userId : this.userId}).observe({
          added: function(doc, idx) {
            QollTypeCustom.find({sort:{'qollType':1}, reactive:true}).forEach(function(item){
              self.added('custom-qoll-types', item._id, item);
            });
          }
        });

        qlog.info('Done initializing the publisher: ALL_QOLL_TYPE_CUSTOM, uuid: ' + uuid, filename);
        initializing = false;
        self.ready();

        self.onStop(function(){
                handle.stop();
        });
});